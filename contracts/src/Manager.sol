// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Vault} from "./Vault.sol";

contract Manager {

    mapping (address user => address[] vaults) public vaults; 

    event VaultCreated(address vault, address user);

    address immutable public AAVE_POOL_ADDRESS;

    constructor(address _aave_pool) {
        AAVE_POOL_ADDRESS = _aave_pool;
    }
    
    function createVault(
        uint8 color, 
        string memory name
    ) public {
        Vault vault = new Vault(AAVE_POOL_ADDRESS, msg.sender, color, name);
        vaults[msg.sender].push(address(vault));
        emit VaultCreated(address(vault), msg.sender);
    }

    function getVaults(address user) public view returns (address[] memory) {
        return vaults[user];
    }

}