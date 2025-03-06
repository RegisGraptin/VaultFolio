// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IPool} from "aave-v3-core/contracts/protocol/pool/Pool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IStrategy} from "../interfaces/IStrategy.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

uint256 constant TOTAL_PERCENT = 1_000_000;

struct SendStrategyParams {
    address vaultAddress;
    address asset;
    address to;
    uint256 minSupplyThreshold;
    uint256 percentAllocation;
    uint256 executionAfter;
}

// FIXME: Swap strategy
// https://docs.uniswap.org/contracts/v3/guides/swaps/single-swaps



// FIXME: precise the owner should be the manager
// FIXME double check subscriptionId
contract SendStrategy is IStrategy, Ownable {
    constructor(address owner_) Ownable(owner_) {}

    uint256 public subscriptionId;

    mapping(uint256 => SendStrategyParams) public params;
    mapping(uint256 => uint256 timestamps) public lastExecution;
    mapping(uint256 => bool) public activated;

    error InvalidPercentAllocationError();
    error InvalidToAddressError();

    function subscribe(
        bytes memory _params
    ) external override onlyOwner returns (uint256) {
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

        params[subscriptionId] = strategyParams;
        activated[subscriptionId] = true;
        subscriptionId++;

        return subscriptionId - 1;
    }

    function unsubscribe(uint256 _subscriptionId) external override onlyOwner {
        activated[_subscriptionId] = false;

        delete params[_subscriptionId];
        delete lastExecution[_subscriptionId];

        emit StrategyUnubscribed(_subscriptionId);
    }

    function _isExecutable (uint256 _subscriptionId) internal view returns (bool) {
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
    ) external override onlyOwner returns (bool) {
        if (!_isExecutable(_subscriptionId)) {
            // FIXME: should we revert instead?
            return false;
        }

        // Update last execution
        lastExecution[_subscriptionId] =
            block.timestamp +
            params[_subscriptionId].executionAfter;

        uint256 vaultBalance = IERC20(params[_subscriptionId].asset).balanceOf(
            params[_subscriptionId].vaultAddress
        );
        uint256 amountToSend = (vaultBalance *
            params[_subscriptionId].percentAllocation) / TOTAL_PERCENT;

        // FIXME: double check for weird ERC20 issue
        IERC20(params[_subscriptionId].asset).transfer(
            params[_subscriptionId].to,
            amountToSend
        );

        // Event

        return true;
    }
}
