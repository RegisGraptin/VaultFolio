// SPDX-License-Identifier: MIT
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
contract SendStrategy is IStrategy {
    
    uint256 public subscriptionId;

    mapping(uint256 subscriptionId => address vaultAddress) public owner;
    mapping(uint256 => SendStrategyParams) public params;
    mapping(uint256 => uint256 timestamps) public lastExecution;
    mapping(uint256 => bool) public activated;

    error InvalidPercentAllocationError();
    error InvalidToAddressError();

    // TODO: Do we want to create an additional layer blocking the subscription
    // and only the manager can do it?

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

        uint256 availableAmount = vaultBalance - params[_subscriptionId].minSupplyThreshold;
        uint256 amountToSend = (availableAmount * params[_subscriptionId].percentAllocation) / TOTAL_PERCENT;

        // FIXME: double check for weird ERC20 issue
        IERC20(params[_subscriptionId].asset).transfer(
            params[_subscriptionId].to,
            amountToSend
        );

        // Event

        return true;
    }
}
