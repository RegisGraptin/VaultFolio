// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IPool} from 'aave-v3-core/contracts/protocol/pool/Pool.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import {Test, console} from 'forge-std/Test.sol';
import {Vault} from '../../src/Vault.sol';
import {Manager} from '../../src/Manager.sol';
import {SendTokenStrategy} from '../../src/strategy/SendTokenStrategy.sol';

contract SendTokenStrategyTest is Test {

    address public ownerManager = makeAddr("owner");
    address public user = makeAddr('user');

    // Scroll address
    address immutable public POOL_ADDRESSES_PROVIDER_ADDRESS = 0x69850D0B276776781C063771b161bd8894BCdD04;
    address immutable public UNISWAP_ROUTER_ADDRESS = 0xfc30937f5cDe93Df8d48aCAF7e6f5D8D8A31F636;

    IERC20 public usdc = IERC20(0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4); 
    IERC20 public wbtc = IERC20(0x3C1BCa5a656e69edCD0D4E36BEbb3FcDAcA60Cf1); 

    Manager public manager;
    Vault public vault;

    SendTokenStrategy public sendTokenStrategy;

    function setUp() public {
        vm.createSelectFork('https://rpc.ankr.com/scroll');

        sendTokenStrategy = new SendTokenStrategy(UNISWAP_ROUTER_ADDRESS);

        manager = new Manager(ownerManager, POOL_ADDRESSES_PROVIDER_ADDRESS);
        vault = new Vault(POOL_ADDRESSES_PROVIDER_ADDRESS, address(manager), user, 1, 'Test');
    }


    function test_SubscribeStrategy() public {

        vm.startPrank(address(vault));

        bytes memory params = abi.encode(
            address(vault),
            address(usdc),
            address(wbtc),
            vault.owner(),
            uint256(50 * 1e6),
            uint256(500_000),  // 50%
            uint256(60 * 60 * 24 * 7) // Weekly
        );

        uint256 subscriptionId = sendTokenStrategy.subscribe(params);
        
        assertEq(subscriptionId, 0);
        assertTrue(sendTokenStrategy.activated(subscriptionId));
        assertEq(sendTokenStrategy.lastExecution(subscriptionId), 0);
        assertEq(sendTokenStrategy.owner(subscriptionId), address(vault));


        // Add some liquidity to the vault to execute the strategy
        uint256 supplyAmount = 100 * 1e6;
        deal(address(usdc), address(vault), supplyAmount);

        uint256 usdcBalance = usdc.balanceOf(address(vault));
        assertEq(usdcBalance, supplyAmount, "Invalid USDC balance");

        // Execute the strategy

        // FIXME: Issue in current approach, need to think on how we can approve the strategy contract
        // Should it be when the user subscribe to it? How should we handle the amount? 

        usdc.approve(address(sendTokenStrategy), supplyAmount);
        sendTokenStrategy.execute(subscriptionId);


        assertEq(sendTokenStrategy.lastExecution(subscriptionId), block.timestamp);


        vm.stopPrank();
    }

}