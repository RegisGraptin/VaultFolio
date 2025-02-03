// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IPool} from 'aave-v3-core/contracts/protocol/pool/Pool.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import {Test, console} from 'forge-std/Test.sol';
import {Vault} from '../src/Vault.sol';

contract VaultTest is Test {
    
    Vault public vault;

    // Mainnet Aave V3 Pool Address
    IPool public pool = IPool(0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2);
    
    // Test user
    address public user = makeAddr('user');

    // Tokens (Mainnet addresses)
    IERC20 public usdc = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48); // USDC
    IERC20 public aUsdc = IERC20(0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c); // aUSDC


    function setUp() public {
        vm.createSelectFork('https://rpc.ankr.com/eth');

        vault = new Vault(user); // FIXME: should it be 'msg.sender' instead ?
    }

    function test_Supply() public {
        uint256 supplyAmount = 1000 * 1e6; // USDC has 6 decimals
        deal(address(usdc), user, supplyAmount);

        // Step 2: Approve Aave Pool to spend USDC
        vm.startPrank(user);
        usdc.approve(address(vault), supplyAmount);

        // Step 3: Supply USDC to Aave
        vault.supply(address(usdc), supplyAmount);

        // Step 4: Check the user’s aUSDC balance
        uint256 aUsdcBalance = aUsdc.balanceOf(address(vault));
        assertGt(aUsdcBalance, 0, 'aUSDC balance should increase after supply');
        vm.stopPrank();
    }
}
