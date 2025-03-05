// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AutomationCompatibleInterface} from "chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";

import {IManager} from "./interfaces/IManager.sol";
import {IVault} from "./interfaces/IVault.sol";
import {Vault} from "./Vault.sol";

contract Manager is IManager, Ownable, AutomationCompatibleInterface {


    // For automate action, we can have the possibility to add forwarer address 
    // from chainlink allowing us to have a trusted address that execute the stratgies
    // https://docs.chain.link/chainlink-automation/guides/forwarder
    // Need to think if we want to add this check.
    // Not sure as we want to execute them when their are ready.
    // => Any one could run this

    

    // AAVE Referral code - TBD as not available at the moment
    uint16 public aaveReferralCode = 0;


    address[] public allVaults;  // FIXME: 
    mapping (address user => address[] vaults) public vaults; 

    address immutable public POOL_ADDRESSES_PROVIDER_ADDRESS;

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

    

    function setAaveReferralCode(uint16 _aaveReferralCode) public onlyOwner {
        aaveReferralCode = _aaveReferralCode;
    }



    function getVaults(address user) public view returns (address[] memory) {
        return vaults[user];
    }

    // FIXME: Check how can I saved the vault value
    // Need to avoid any malicious attack that can call it

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

}

// FIXME: limitation: what happened if I have more than thousands vaults to check?
// Reach the gas limit?