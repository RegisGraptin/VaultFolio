// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {IPool} from "aave-v3-core/contracts/protocol/pool/Pool.sol";
import {IPoolAddressesProvider} from "aave-v3-core/contracts/protocol/configuration/PoolAddressesProvider.sol";

import {IManager} from "./interfaces/IManager.sol";
import {IVault} from "./interfaces/IVault.sol";
import {IStrategy} from "./interfaces/IStrategy.sol";
import {IStrategyExecutor} from "./interfaces/IStrategyExecutor.sol";

import {SubscribeStrategyStruct} from "./interfaces/IStrategy.sol";

contract Vault is IVault, Ownable, ReentrancyGuard {
    /// Logic of the smart contract
    /// It should store all the representation value of AAVE, meaning the aToken
    /// from a lending position or the debt token from a borrowing position.
    ///
    /// All the liqudity should remained to the user.

    // Notice the wraped token stays in the vault

    address public immutable POOL_ADDRESSES_PROVIDER_ADDRESS;
    
    address public immutable manager;
    uint8 public color;
    string public name;

    uint256 public numberOfActivatedStrategies;

    SubscribeStrategyStruct[] public subscribedStrategies;

    constructor(
        address _aaveProviderAddress,
        address _manager,
        address owner_,
        uint8 _color,
        string memory _name
    ) Ownable(owner_) {
        POOL_ADDRESSES_PROVIDER_ADDRESS = _aaveProviderAddress;
        manager = _manager;
        color = _color;
        name = _name;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }

    function _aavePoolAddress() internal view returns (address) {
        return IPoolAddressesProvider(POOL_ADDRESSES_PROVIDER_ADDRESS).getPool();
    }

    function supply(address asset, uint256 amount) external {
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        IERC20(asset).approve(_aavePoolAddress(), amount);
        IPool(_aavePoolAddress()).supply(
            asset,
            amount,
            address(this),
            IManager(manager).aaveReferralCode()
        );
        emit Supply(asset, amount);
    }

    function withdraw(address asset, uint256 amount) external {
        // Withdraw the vault position and send back the token to the users
        IPool(_aavePoolAddress()).withdraw(asset, amount, msg.sender);
        emit Withdraw(asset, amount);
    }

    function borrow(
        address asset,
        uint256 amount,
        uint256 interestRateMode
    ) external {
        // interestRateMode: 1 for Stable, 2 for Variable
        IPool(_aavePoolAddress()).borrow(
            asset,
            amount,
            interestRateMode,
            IManager(manager).aaveReferralCode(),
            address(this)
        );

        // Send the token to the users
        // Isolate the debt in the smart contract
        IERC20(asset).transfer(msg.sender, amount);

        emit Borrow(asset, amount, interestRateMode);
    }

    // * @return The actual amount being repaid
    // Possibility to defined type(uint256).max
    // In order to avoid remainign dust in the SC
    function repay(
        address asset,
        uint256 amount,
        uint256 interestRateMode
    ) external returns (uint256) {
        IERC20(asset).transferFrom(msg.sender, address(this), amount);

        IERC20(asset).approve(_aavePoolAddress(), amount);

        uint256 amountRepaid = IPool(_aavePoolAddress()).repay(
            asset,
            amount,
            interestRateMode,
            address(this)
        );
        emit Repay(asset, amount, interestRateMode);
        return amountRepaid;
    }

    //////////////////////////////////////////////////////////////////
    /// Manage Strategies Functions
    //////////////////////////////////////////////////////////////////

    function hasStrategies() external view override returns (bool) {
        return numberOfActivatedStrategies > 0;
    }

    function needExecution() external view override returns (bool) {
        for (uint256 i = 0; i < subscribedStrategies.length; i++) {
            IStrategy strategy = IStrategy(subscribedStrategies[i].strategyAddress); 

            bool executable = strategy.isExecutable(
                subscribedStrategies[i].subscriptionId
            );
            if (executable) {
                return true;
            }
        }
        return false;
    }

    

    function addStrategy(
        address strategyAddress,
        bytes memory params
    ) external override onlyOwner returns (uint256) {

        // FIXME: Check if manager is whitelisted and have access to the strategy


        // Get a new subscription id and add the strategy to the vault's list
        uint256 subscribeStrategyId = IStrategy(strategyAddress).subscribe(params);

        subscribedStrategies.push(
            SubscribeStrategyStruct(
                strategyAddress, 
                subscribeStrategyId
            )
        );

        numberOfActivatedStrategies++;

        // FIXME: TBM
        emit StrategyAdded(
            numberOfActivatedStrategies - 1,
            strategyAddress,
            params
        );
        return numberOfActivatedStrategies - 1;
    }

    // FIXME: remove params and delegate the management to the strategy
    // Plus add a strategyId to know which params used in the strategy.

    function removeStrategy(uint256 strategyId) external override onlyOwner {
        if (strategyId >= numberOfActivatedStrategies) {
            revert InvalidStrategyId(strategyId);
        }
        address strategyAddress = subscribedStrategies[strategyId].strategyAddress;

        subscribedStrategies[strategyId] = subscribedStrategies[subscribedStrategies.length - 1];

        
        subscribedStrategies.pop();
        numberOfActivatedStrategies--;

        emit StrategyRemoved(strategyId, strategyAddress);
    }

    function executeStrategies() external override onlyManager nonReentrant {
        for (uint256 i = 0; i < subscribedStrategies.length; i++) {
            IStrategy strategy = IStrategy(subscribedStrategies[i].strategyAddress); 

            bool executable = strategy.isExecutable(
                subscribedStrategies[i].subscriptionId
            );
            if (executable) {
                strategy.execute(subscribedStrategies[i].subscriptionId);
                emit StrategyExecuted(i, subscribedStrategies[i].strategyAddress, subscribedStrategies[i].subscriptionId);
            }
        }
    }
}
