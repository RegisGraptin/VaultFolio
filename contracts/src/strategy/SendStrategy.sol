// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import '@uniswap/v3-periphery/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/libraries/TransferHelper.sol';

import {IPool} from "aave-v3-core/contracts/protocol/pool/Pool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IStrategy} from "../interfaces/IStrategy.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

uint256 constant TOTAL_PERCENT = 1_000_000;

struct SendStrategyParams {
    address vaultAddress;
    address yieldAsset;
    address targetAsset;
    address to;
    uint256 minSupplyThreshold;
    uint256 percentAllocation;
    uint256 executionAfter;
}

/// @title Send Token Strategy.
/// @notice Given a yield token, convert it to the targeted token and send it to the request address.
/// As an example, take 20% yield from USDC and convert it to ETH to send it to a custom address. 
/// @dev For the swap, we are relying on Uniswap V3 at the moment.
/// Documentation: https://docs.uniswap.org/contracts/v3/guides/swaps/single-swaps
contract SendTokenStrategy is IStrategy {
    
    ISwapRouter public immutable swapRouter;
    uint24 public constant poolFee = 3000;

    uint256 public subscriptionId;

    mapping(uint256 subscriptionId => address vaultAddress) public owner;
    mapping(uint256 => SendStrategyParams) public params;
    mapping(uint256 => uint256 timestamps) public lastExecution;
    mapping(uint256 => bool) public activated;

    error InvalidPercentAllocationError();
    error InvalidToAddressError();


    constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

    function subscribe(
        bytes memory _params
    ) external override returns (uint256) {
        SendStrategyParams memory strategyParams = abi.decode(_params, (SendStrategyParams));
        if (
            strategyParams.percentAllocation == 0 ||
            strategyParams.percentAllocation > TOTAL_PERCENT
        ) {
            revert InvalidPercentAllocationError();
        }
        if (strategyParams.to == address(0)) {
            revert InvalidToAddressError();
        }
        // FIXME: Check address token

        owner[subscriptionId] = msg.sender;
        params[subscriptionId] = strategyParams;
        activated[subscriptionId] = true;
        subscriptionId++;

        return subscriptionId - 1;
    }

    function unsubscribe(uint256 _subscriptionId) external override {
        activated[_subscriptionId] = false;

        delete owner[subscriptionId];
        delete params[_subscriptionId];
        delete lastExecution[_subscriptionId];

        emit StrategyUnubscribed(_subscriptionId);
    }

    function _isExecutable(uint256 _subscriptionId) internal view returns (bool) {
        return (lastExecution[_subscriptionId] <= block.timestamp &&
            IERC20(params[_subscriptionId].asset).balanceOf(
                params[_subscriptionId].vaultAddress
            ) >
            params[_subscriptionId].minSupplyThreshold);
    }

    function isExecutable(
        uint256 _subscriptionId
    ) external view override returns (bool) {
        return _isExecutable(_subscriptionId);
    }

    function execute(
        uint256 _subscriptionId
    ) external override returns (bool) {
        require(owner[subscriptionId] == msg.sender, "Not allowed");
        require(_isExecutable(_subscriptionId), "Not executable");
        
        // Update last execution
        lastExecution[_subscriptionId] = block.timestamp + params[_subscriptionId].executionAfter;

        uint256 vaultBalance = IERC20(params[_subscriptionId].asset).balanceOf(
            params[_subscriptionId].vaultAddress
        );

        if (vaultBalance <= params[_subscriptionId].minSupplyThreshold) {
            return false;
        }

        // TODO: 
        // FIXME: Need to pay fee for the automation
        // FIXME: And take fee for the procotol


        uint256 availableAmount = vaultBalance - params[_subscriptionId].minSupplyThreshold;
        uint256 amountToSend = (availableAmount * params[_subscriptionId].percentAllocation) / TOTAL_PERCENT;

        
        // Transfer the specified amount of DAI to this contract.
        TransferHelper.safeTransferFrom(params[_subscriptionId].asset, msg.sender, address(this), amountToSend);

        // Approve the router to spend DAI.
        TransferHelper.safeApprove(params[_subscriptionId].asset, address(swapRouter), amountToSend);

        // FIXME: Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.

        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: params[_subscriptionId].asset,
                tokenOut: params[_subscriptionId].targetAsset,
                fee: poolFee,
                recipient: params[_subscriptionId].to,
                deadline: block.timestamp,
                amountIn: amountToSend,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);


        // FIXME: Do we want a customizable strategy for this one?

        emit StrategyExecuted(_subscriptionId);
        
        return true;
    }
}
