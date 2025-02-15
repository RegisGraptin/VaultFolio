// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Vault} from "./Vault.sol";

contract Manager {

    mapping (address user => address[] vaults) public vaults; 

    event VaultCreated(address vault, address user);

    constructor() {}

    function createVault() public {
        Vault vault = new Vault(msg.sender);
        vaults[msg.sender].push(address(vault));
        emit VaultCreated(address(vault), msg.sender);
    }

    function getVaults(address user) public view returns (address[] memory) {
        return vaults[user];
    }

}