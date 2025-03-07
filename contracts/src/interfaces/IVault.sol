// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IStrategyExecutor} from "./IStrategyExecutor.sol";


interface IVault is IStrategyExecutor {

    /// Get the manager address
    function manager() view external returns(address);

    /// Properties of the vault
    function name() view external returns(string memory);
    function color() view external returns(uint8);
    
    event Supply(address indexed asset, uint256 amount);
    event Withdraw(address indexed asset, uint256 amount);
    event Borrow(address indexed asset, uint256 amount, uint256 interestRateMode);
    event Repay(address indexed asset, uint256 amount, uint256 interestRateMode);

    /// @notice Supply the assets with the given amount to the lending provider.
    /// @param asset Asset to supply.
    /// @param amount Amount to supply.
    function supply(address asset, uint256 amount) external;

    /// @notice Withdraw the assets from the lending provider.
    /// @param asset Asset to withdraw.
    /// @param amount Amount to withdraw.
    function withdraw(address asset, uint256 amount) external;

    /// @notice Borrow the assets from the lending provider.
    /// @param asset Asset to borrow.
    /// @param amount Amount to borrow.
    /// @param interestRateMode Interest rate mode of the borrow. (1 for Stable, 2 for Variable)
    function borrow(
        address asset,
        uint256 amount,
        uint256 interestRateMode
    ) external;

    /// @notice Repay the borrowed assets to the lending provider.
    /// @param asset Asset to repay.
    /// @param amount Amount to repay. ("type(uint256).max" to fully repay the debt)
    /// @param interestRateMode Interest rate mode of the borrow. (1 for Stable, 2 for Variable)
    function repay(
        address asset,
        uint256 amount,
        uint256 interestRateMode
    ) external returns (uint256);
}

