// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {IManager} from "./interfaces/IManager.sol";
import {IVault} from "./interfaces/IVault.sol";
import {Vault} from "./Vault.sol";

/// @title Vault Manager
/// @dev The contract is responsible for creating and managing vaults.
/// It also implements the Chainlink's Automation interface to automate the execution of strategies.
contract Manager is IManager, Ownable {

    /// @notice Address of the AAVE Pool Address Provider allowing us to fetch the pool address
    address immutable public POOL_ADDRESSES_PROVIDER_ADDRESS;

    /// @notice AAVE Referral code (Not applicable at the moment)
    uint16 public aaveReferralCode = 0;

    /// @notice Addresses' list of all vaults
    address[] public allVaults;

    /// @notice Mapping of user to vaults
    mapping (address user => address[] vaults) public vaults; 

    /// @notice Indicate if a strategy is whitelisted
    mapping (address strategyAddress => bool whitelisted) public isWhitelistedStrategy;

    constructor(
        address owner_,
        address _aavePoolAddressProvider
    ) Ownable(owner_) {
        POOL_ADDRESSES_PROVIDER_ADDRESS = _aavePoolAddressProvider;
    }
    
    function createVault(
        uint8 color, 
        string memory name
    ) public {
        Vault vault = new Vault(POOL_ADDRESSES_PROVIDER_ADDRESS, address(this), msg.sender, color, name);
        vaults[msg.sender].push(address(vault));
        allVaults.push(address(vault));
        emit VaultCreated(address(vault), msg.sender);
    }

    /// @notice Set the possibility to update the AAVE referral code
    function setAaveReferralCode(uint16 _aaveReferralCode) public onlyOwner {
        aaveReferralCode = _aaveReferralCode;
    }

    function getVaults(address user) public view returns (address[] memory) {
        return vaults[user];
    }

    //////////////////////////////////////////////////////////////////
    /// Strategies automation
    //////////////////////////////////////////////////////////////////

    /// Check if any vault need to execute strategies
    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory performData) {
        address[] memory dueVaults = new address[](allVaults.length);
        uint256 count = 0;

        for (uint256 i = 0; i < allVaults.length; i++) {
            IVault vault = IVault(allVaults[i]);
            if (vault.hasStrategies() && vault.needExecution()) {
                dueVaults[count] = allVaults[i];
                count++;
            }
        }

        if (count > 0) {
            upkeepNeeded = true;
            performData = abi.encode(_trimArray(dueVaults, count));
        } else {
            upkeepNeeded = false;
            performData = "";
        }
    }

    // Execute eligible Vaults' strategies
    function performUpkeep(bytes calldata performData) external override {
        address[] memory dueVaults = abi.decode(performData, (address[]));
        for (uint256 i = 0; i < dueVaults.length; i++) {
            IVault vault = IVault(dueVaults[i]);
            if (vault.needExecution()) {
                vault.executeStrategies();
            }
        }
    }

    // Helper to trim the dueVaults array to actual size
    function _trimArray(address[] memory array, uint256 length) private pure returns (address[] memory) {
        address[] memory trimmed = new address[](length);
        for (uint256 i = 0; i < length; i++) trimmed[i] = array[i];
        return trimmed;
    }
    
    function whitelistStrategy(address strategy) external override onlyOwner {
        isWhitelistedStrategy[strategy] = true;
        emit WhitelistStrategy(strategy);
    }

    function unwhitelistStrategy(address strategy) external override onlyOwner {
        isWhitelistedStrategy[strategy] = false;
        emit UnwhitelistStrategy(strategy);
    }

}
