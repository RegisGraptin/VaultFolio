// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IStrategyExecutor} from "./IStrategyExecutor.sol";

interface IVault is IStrategyExecutor {

    event Supply(address indexed asset, uint256 amount);
    event Withdraw(address indexed asset, uint256 amount);
    event Borrow(address indexed asset, uint256 amount, uint256 interestRateMode);
    event Repay(address indexed asset, uint256 amount, uint256 interestRateMode);


    function supply(address asset, uint256 amount) external;

    function withdraw(address asset, uint256 amount) external;

    function borrow(
        address asset,
        uint256 amount,
        uint256 interestRateMode
    ) external;

    function repay(
        address asset,
        uint256 amount,
        uint256 interestRateMode
    ) external returns (uint256);
}

