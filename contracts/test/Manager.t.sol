// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IPool} from 'aave-v3-core/contracts/protocol/pool/Pool.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import {Test, console} from 'forge-std/Test.sol';
import {Vault} from '../src/Vault.sol';
import {Manager} from '../src/Manager.sol';
import {SendTokenStrategy} from '../src/strategy/SendTokenStrategy.sol';

contract ManagerTest is Test {

    // Scroll Sepolia address
    address immutable public POOL_ADDRESSES_PROVIDER_ADDRESS = 0x52A27dC690F8652288194Dd2bc523863eBdEa236;
    address immutable public UNISWAP_ROUTER_ADDRESS = 0xfc30937f5cDe93Df8d48aCAF7e6f5D8D8A31F636;

    address ownerManager = makeAddr("owner");
    Manager public manager;
    SendTokenStrategy public sendTokenStrategy;

    function setUp() public {
        vm.createSelectFork('https://rpc.ankr.com/scroll_sepolia_testnet');

        vm.startPrank(ownerManager);
        manager = new Manager(ownerManager, POOL_ADDRESSES_PROVIDER_ADDRESS);

        // Deploy and whitelist strategies
        sendTokenStrategy = new SendTokenStrategy(UNISWAP_ROUTER_ADDRESS);

        manager.whitelistStrategy(address(sendTokenStrategy));
        vm.stopPrank();
    }

    function test_CreateNewVault() public {
        
        address user = makeAddr('user'); 
        vm.startPrank(user);

        assertEq(manager.getVaults(user).length, 0);

        manager.createVault(0, "Long-Term Savings");
        assertEq(manager.getVaults(user).length, 1);
    }

    function test_vaultSubscribeStrategy() public {
        // FIXME
    }

}