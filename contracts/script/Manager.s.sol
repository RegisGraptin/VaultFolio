// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Manager} from "../src/Manager.sol";
import {SendTokenStrategy} from "../src/strategy/SendTokenStrategy.sol";

// AAVE addresses
// https://github.com/bgd-labs/aave-address-book/blob/main/src/AaveV3ScrollSepolia.sol

contract ManagerScript is Script {
    Manager public manager;
    address public POOL_ADDRESSES_PROVIDER_ADDRESS;

    function setUp() public {}

    function run() public returns (address, address) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address account = vm.addr(deployerPrivateKey);

        uint256 chainId = block.chainid;

        if (chainId == 1) {  // ETH Mainnet
            POOL_ADDRESSES_PROVIDER_ADDRESS = 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e;
        } else if (chainId == 534352) {  // Scroll
            POOL_ADDRESSES_PROVIDER_ADDRESS = 0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A;
        } else if (chainId == 534351) {  // Scroll Sepolia
            POOL_ADDRESSES_PROVIDER_ADDRESS = 0x52A27dC690F8652288194Dd2bc523863eBdEa236;
        } else {
            revert("Unsupported network");
        }

        manager = new Manager(account, POOL_ADDRESSES_PROVIDER_ADDRESS);

        // Create the strategies
        // No Scroll address at the moment: https://docs.uniswap.org/contracts/v3/reference/deployments/
        SendTokenStrategy sendTokenStrategy = new SendTokenStrategy(address(0));

        manager.whitelistStrategy(address(sendTokenStrategy));


        vm.stopBroadcast();
        
        return (address(manager), address(sendTokenStrategy));
    }
}
