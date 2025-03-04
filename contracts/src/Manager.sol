// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Vault} from "./Vault.sol";
import {AutomationCompatibleInterface} from "chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";

contract Manager is Ownable, AutomationCompatibleInterface {


    // For automate action, we can have the possibility to add forwarer address 
    // from chainlink allowing us to have a trusted address that execute the stratgies
    // https://docs.chain.link/chainlink-automation/guides/forwarder
    // Need to think if we want to add this check.
    // Not sure as we want to execute them when their are ready.
    // => Any one could run this

    

    // AAVE Referral code - TBD as not available at the moment
    uint16 public AAVE_REFERRAL_CODE = 0;


    address[] public allVaults;  // FIXME: 
    mapping (address user => address[] vaults) public vaults; 

    event VaultCreated(address vault, address user);

    address immutable public AAVE_POOL_ADDRESS;

    constructor(
        address owner_,
        address _aave_pool
    ) Ownable(owner_) {
        AAVE_POOL_ADDRESS = _aave_pool;
    }
    
    function createVault(
        uint8 color, 
        string memory name
    ) public {
        Vault vault = new Vault(AAVE_POOL_ADDRESS, address(this), msg.sender, color, name);
        vaults[msg.sender].push(address(vault));
        allVaults.push(address(vault));
        emit VaultCreated(address(vault), msg.sender);
    }

    function getAaveReferralCode() public view returns (uint16) {
        return AAVE_REFERRAL_CODE;
    }

    function setAaveReferralCode(uint16 code) public onlyOwner {
        AAVE_REFERRAL_CODE = code;
    }



    function getVaults(address user) public view returns (address[] memory) {
        return vaults[user];
    }

    // FIXME: Check how can I saved the vault value
    // Need to avoid any malicious attack that can call it


     // Chainlink Automation: Check if any Vault needs execution
    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory performData) {
        address[] memory dueVaults = new address[](allVaults.length);
        uint256 count = 0;

        for (uint256 i = 0; i < allVaults.length; i++) {
            Vault vault = Vault(allVaults[i]);
            if (vault.hasStrategies() && vault.nextExecutionTime() <= block.timestamp) {
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

    // Chainlink Automation: Execute eligible Vaults' strategies
    function performUpkeep(bytes calldata performData) external override {
        address[] memory dueVaults = abi.decode(performData, (address[]));
        for (uint256 i = 0; i < dueVaults.length; i++) {
            Vault vault = Vault(dueVaults[i]);
            if (vault.nextExecutionTime() <= block.timestamp) {
                vault.executeStrategies();
                vault.updateExecutionTime();
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