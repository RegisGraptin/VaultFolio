// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {IPool} from "aave-v3-core/contracts/protocol/pool/Pool.sol";
import {IPoolAddressesProvider} from "aave-v3-core/contracts/protocol/configuration/PoolAddressesProvider.sol";

import {IManager} from "./interfaces/IManager.sol";
import {IVault} from "./interfaces/IVault.sol";
import {IStrategy, SubscribeStrategyStruct} from "./interfaces/IStrategy.sol";
import {IStrategyExecutor} from "./interfaces/IStrategyExecutor.sol";

/// @title Vault contract.
/// @dev The contract acts as a wrapper to the AAVE protocol.
/// It allows users to interact with the AAVE protocol by isolating their liquidity directly inside a smart contract.
/// Allowing them to have a better control over their position.
/// The contract also allows the user to subscribe to strategies that will be executed automatically.
/// The strategies are owned by the manager.
contract Vault is IVault, Ownable, ReentrancyGuard {
    
    /// @notice Address of the AAVE Pool Address Provider allowing us to fetch the pool address
    address public immutable POOL_ADDRESSES_PROVIDER_ADDRESS;

    /// @notice Address of the manager
    address public immutable manager;
    
    uint8 public color;
    string public name;

    /// @notice Number of activated strategies in the vault.
    uint256 public numberOfActivatedStrategies;

    /// @notice List of strategies subscribed by the vault.
    SubscribeStrategyStruct[] public subscribedStrategies;

    /// @notice Fetch the subscribed strategies
    function getAllSubscribedStrategies() external view returns (SubscribeStrategyStruct[] memory) {
        return subscribedStrategies;
    }

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

    function supply(address asset, uint256 amount) external onlyOwner {
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

    function withdraw(address asset, uint256 amount) external onlyOwner {
        uint256 amountWitdraw = IPool(_aavePoolAddress()).withdraw(asset, amount, msg.sender);
        emit Withdraw(asset, amountWitdraw);
    }

    function borrow(
        address asset,
        uint256 amount,
        uint256 interestRateMode
    ) external onlyOwner {
        IPool(_aavePoolAddress()).borrow(
            asset,
            amount,
            interestRateMode,
            IManager(manager).aaveReferralCode(),
            address(this)
        );
        IERC20(asset).transfer(msg.sender, amount);
        emit Borrow(asset, amount, interestRateMode);
    }

    function repay(
        address asset,
        uint256 amount,
        uint256 interestRateMode
    ) external onlyOwner returns (uint256) {
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        IERC20(asset).approve(_aavePoolAddress(), amount);
        uint256 amountRepaid = IPool(_aavePoolAddress()).repay(
            asset,
            amount,
            interestRateMode,
            address(this)
        );
        emit Repay(asset, amountRepaid, interestRateMode);
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
            if (!IManager(manager).isWhitelistedStrategy(subscribedStrategies[i].strategyAddress)) {
                continue;
            }

            IStrategy strategy = IStrategy(
                subscribedStrategies[i].strategyAddress
            );

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
        require(IManager(manager).isWhitelistedStrategy(strategyAddress), "Strategy not whitelisted");

        // Get a new subscription id and add the strategy to the vault's list
        uint256 subscribeStrategyId = IStrategy(strategyAddress).subscribe(
            params
        );

        subscribedStrategies.push(
            SubscribeStrategyStruct(strategyAddress, subscribeStrategyId)
        );
        numberOfActivatedStrategies++;

        emit StrategyAdded(
            strategyAddress,
            subscribeStrategyId,
            params
        );
        return numberOfActivatedStrategies - 1;
    }

    function removeStrategy(uint256 strategyId) external override onlyOwner {
        if (strategyId >= numberOfActivatedStrategies) {
            revert InvalidStrategyId(strategyId);
        }
        address strategyAddress = subscribedStrategies[strategyId].strategyAddress;
        uint256 subscriptionId = subscribedStrategies[strategyId].subscriptionId;

        // Remove the strategy and optimize the list of strategies
        subscribedStrategies[strategyId] = subscribedStrategies[subscribedStrategies.length - 1];
        subscribedStrategies.pop();
        numberOfActivatedStrategies--;

        emit StrategyRemoved(strategyAddress, subscriptionId);
    }

    function executeStrategies() external override onlyManager nonReentrant {
        for (uint256 i = 0; i < subscribedStrategies.length; i++) {
            // Be sure the strategy is still whitelisted
            if (!IManager(manager).isWhitelistedStrategy(subscribedStrategies[i].strategyAddress)) {
                continue;
            }

            IStrategy strategy = IStrategy(
                subscribedStrategies[i].strategyAddress
            );

            bool executable = strategy.isExecutable(
                subscribedStrategies[i].subscriptionId
            );
            if (executable) {
                strategy.execute(subscribedStrategies[i].subscriptionId);
                emit StrategyExecuted(
                    subscribedStrategies[i].strategyAddress,
                    subscribedStrategies[i].subscriptionId
                );
            }
        }
    }
}
