// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;


struct SubscribeStrategyStruct {
    address strategyAddress;
    uint256 subscriptionId;
}

/// Strategy Interface used by the Vault to execute automate actions.
interface IStrategy {

    /// @notice Returns the last execution timestamp of a strategy.
    /// @param subscriptionId The ID of the strategy.
    /// @return The last execution timestamp.
    function lastExecution(uint256 subscriptionId) external view returns (uint256);

    /// @notice Checks if a strategy is activated.
    /// @param subscriptionId The ID of the strategy.
    /// @return True if the strategy is activated, false otherwise.
    function activated(uint256 subscriptionId) external view returns (bool);

    event StrategySubscribed(uint256 subscriptionId, address vault, bytes params);

    event StrategyUnubscribed(uint256 subscriptionId);

    event StrategyExecuted(uint256 subscriptionId);

    /// @notice Subscribes to a strategy with the given parameters.
    /// @param _params The parameters of the strategy encoded as bytes.
    /// @return The ID of the subscribed strategy.
    function subscribe(bytes memory _params) external returns (uint256);

    /// @notice Unsubscribes from a strategy.
    /// @param subscriptionId The ID of the strategy to unsubscribe from.
    function unsubscribe(uint256 subscriptionId) external;

    /// @notice Checks if a strategy is executable.
    /// @param subscriptionId The ID of the strategy.
    /// @return True if the strategy is executable, false otherwise.
    function isExecutable(uint256 subscriptionId) external view returns (bool);

    /// @notice Executes a strategy.
    /// @param subscriptionId The ID of the strategy to execute.
    /// @return True if the strategy was successfully executed, false otherwise.
    function execute(uint256 subscriptionId) external returns (bool);
}
