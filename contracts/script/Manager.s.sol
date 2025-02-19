// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Manager} from "../src/Manager.sol";

contract ManagerScript is Script {
    Manager public manager;
    address public AAVE_POOL;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        uint256 chainId = block.chainid;

        if (chainId == 1) {  // ETH Mainnet
            AAVE_POOL = 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2;
        } else if (chainId == 534352) {  // Scroll
            AAVE_POOL = 0x11fCfe756c05AD438e312a7fd934381537D3cFfe;
        } else if (chainId == 534351) {  // Scroll Sepolia
            AAVE_POOL = 0x48914C788295b5db23aF2b5F0B3BE775C4eA9440;
        } else {
            revert("Unsupported network");
        }

        manager = new Manager(AAVE_POOL);

        vm.stopBroadcast();
    }
}
