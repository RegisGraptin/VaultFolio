// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IPool} from 'aave-v3-core/contracts/protocol/pool/Pool.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import {Test, console} from 'forge-std/Test.sol';
import {Vault} from '../src/Vault.sol';
import {Manager} from '../src/Manager.sol';

contract VaultTest is Test {

    address ownerManager = makeAddr("owner");
    
    Manager public manager;
    Vault public vault;

    // Mainnet Aave V3 Pool Address
    address immutable public POOL_ADDRESSES_PROVIDER_ADDRESS = 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e;
    
    // Test user
    address public user = makeAddr('user');

    // Tokens (Mainnet addresses)
    IERC20 public usdc = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48); // USDC
    IERC20 public aUsdc = IERC20(0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c); // aUSDC


    function setUp() public {
        vm.createSelectFork('https://rpc.ankr.com/eth');


        manager = new Manager(ownerManager, POOL_ADDRESSES_PROVIDER_ADDRESS);
        vault = new Vault(POOL_ADDRESSES_PROVIDER_ADDRESS, address(manager), user, 1, 'Test');
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

    function test_Withdraw() public {
        uint256 supplyAmount = 1000 * 1e6; // USDC has 6 decimals
        deal(address(usdc), user, supplyAmount);

        // Step 2: Approve Aave Pool to spend USDC
        vm.startPrank(user);
        usdc.approve(address(vault), supplyAmount);

        // Step 3: Supply USDC to Aave
        vault.supply(address(usdc), supplyAmount);

        // Step 4: Check the user’s aUSDC balance
        vault.withdraw(address(usdc), supplyAmount);
        
        uint256 usdcBalance = usdc.balanceOf(user);
        assertEq(usdcBalance, supplyAmount, 'USDC balance should be equals to the supply amount');
        vm.stopPrank();
    }

    function test_Borrow() public {
        uint256 supplyAmount = 1000 * 1e6; // USDC has 6 decimals
        deal(address(usdc), user, supplyAmount);

        // Step 2: Approve Aave Pool to spend USDC
        vm.startPrank(user);
        usdc.approve(address(vault), supplyAmount);

        // Step 3: Supply USDC to Aave
        vault.supply(address(usdc), supplyAmount);

        // Step 4: The vault balance of uscd should be empty as we changed it to aUSDC
        uint256 usdcBalance = usdc.balanceOf(address(vault));
        assertEq(usdcBalance, 0, 'USDC balance of the vault should empty.');

        // Step 5: Borrow USDC from Aave
        uint256 borrowAmount = 1 * 1e6; // USDC has 6 decimals
        vault.borrow(address(usdc), borrowAmount, 2); // FIXME: Remove this paramter

        // Step 6: Check the user’s USDC balance
        usdcBalance = usdc.balanceOf(address(vault));
        assertEq(usdcBalance, 0, 'USDC balance of the vault should empty.');

        // Step 7: Check the user’s USDC balance
        uint256 userUsdcBalance = usdc.balanceOf(user);
        assertEq(userUsdcBalance, borrowAmount, 'USDC balance should be equals to the borrow amount');
        vm.stopPrank();
    }


    function test_Repay() public {
        uint256 supplyAmount = 1000 * 1e6; // USDC has 6 decimals
        deal(address(usdc), user, supplyAmount);

        // Step 2: Approve Aave Pool to spend USDC
        vm.startPrank(user);
        usdc.approve(address(vault), supplyAmount);

        // Step 3: Supply USDC to Aave
        vault.supply(address(usdc), supplyAmount);

        // Step 4: Borrow USDC from Aave using the vault
        uint256 borrowAmount = 1 * 1e6; // USDC has 6 decimals
        vault.borrow(address(usdc), borrowAmount, 2);

        // Check the user’s USDC balance
        uint256 usdcBalance = usdc.balanceOf(user);
        assertEq(usdcBalance, borrowAmount, 'USDC balance of the user should match the borrow value.');

        // Step 5: Repay USDC to Aave using the vault
        uint256 repayAmount = 1 * 1e6; // USDC has 6 decimals
        usdc.approve(address(vault), repayAmount);
        vault.repay(address(usdc), repayAmount, 2);

        // Step 7: Check the user’s USDC balance
        usdcBalance = usdc.balanceOf(user);
        assertEq(usdcBalance, 0, 'The user should have no more USDC after repayment');
        vm.stopPrank();

    }

}
