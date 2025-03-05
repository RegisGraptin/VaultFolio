// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// FIXME: double check subscriptionId

/// @title Strategy Execution Interface
/// @notice Standard interface for managing and executing modular strategies
/// @dev Implementations should handle strategy storage, validation, and execution logic
interface IStrategyExecutor {
    
    // FIXME: Do I want to defined the subscriptionId ??
    
    event StrategyAdded(
        uint256 strategyId,
        address strategyAddress,
        bytes params
    );
    event StrategyRemoved(uint256 strategyId, address strategyAddress);
    event StrategyExecuted(uint256 strategyId, address strategyAddress, uint256 subscriptionId);

    error InvalidStrategyId(uint256 strategyId);

    /// @notice Checks if executor has any registered strategies
    /// @return true if at least one strategy exists, false otherwise
    function hasStrategies() external view returns (bool);

    function needExecution() external view returns (bool);

    /// @notice Registers a new strategy contract
    /// @dev Emits StrategyAdded event with implementation-specific parameters
    /// @param strategyAddress Address of the strategy contract to add
    /// @param params Parameters of the strategy
    /// @return ID of the newly added strategy
    function addStrategy(address strategyAddress, bytes memory params) external returns (uint256);

    /// @notice Removes a strategy from the executor
    /// @dev Emits StrategyRemoved on success
    /// @param strategyId ID of the strategy to remove
    /// @custom:reverts InvalidStrategyId If strategyId doesn't exist
    function removeStrategy(uint256 strategyId) external;

    /// @notice Executes all registered strategies in sequence
    /// @dev Emits StrategyExecuted for each successful execution
    function executeStrategies() external;
}
