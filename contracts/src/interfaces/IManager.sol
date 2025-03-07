// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AutomationCompatibleInterface} from "chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";

/// @title Manager Interface
/// @notice Manage the vault creation and process all automated action registered in the vaults.
interface IManager is AutomationCompatibleInterface {
    
    /// @notice Check if a strategy is whitelisted.
    /// @param strategy address of the strategy.
    function isWhitelistedStrategy(address strategy) external view returns (bool);

    event VaultCreated(address vault, address user);
    
    event WhitelistStrategy(address strategy);
    event UnwhitelistStrategy(address strategy);

    /// @notice Returns the referral code from AAVE.
    /// @return Referall code.
    function aaveReferralCode() external view returns (uint16);
    
    /// @notice Create a new vault
    /// @param color of the new vault.
    /// @param name of the new vault.
    function createVault(uint8 color, string memory name) external;
    
    /// @notice Get the list of vaults owned by the user.
    /// @param user address owning the vaults.
    /// @return vaults The list of vaults address owned by the user.
    function getVaults(address user) external view returns (address[] memory);

    /// @notice Whitelist a strategy.
    /// @param strategy address of the strategy.
    function whitelistStrategy(address strategy) external;

    /// @notice Unwhitelist a strategy.
    /// @param strategy address of the strategy.
    function unwhitelistStrategy(address strategy) external;

}