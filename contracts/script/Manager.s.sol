// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Manager} from "../src/Manager.sol";

contract ManagerScript is Script {
    Manager public manager;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        manager = new Manager();

        vm.stopBroadcast();
    }
}
