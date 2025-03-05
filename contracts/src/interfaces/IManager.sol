// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IManager {
    
    event VaultCreated(address vault, address user);

    function aaveReferralCode() external view returns (uint16);
    
    function createVault(uint8 color, string memory name) external;
    
    function getVaults(address user) external view returns (address[] memory);

}