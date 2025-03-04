// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';


import {IVault} from "./interfaces/IVault.sol";

// contract SwapReward is IStrategy {
//     // Once I earn more than 5% 
//     // Swap the reward to another assets

contract Vault is IVault, Ownable {
    /// Logic of the smart contract
    /// It should store all the representation value of AAVE, meaning the aToken 
    /// from a lending position or the debt token from a borrowing position.
    /// 
    /// All the liqudity should remained to the user.

    // Notice the wraped token stays in the vault


    address public immutable AAVE_POOL_ADDRESS;
    address public immutable manager;
    uint8 public immutable color;
    string public immutable name;
    

    constructor(
        address _aave_pool,
        address _manager,
        address owner_,
        uint8 _color,
        string memory _name
    ) Ownable(owner_) {
        AAVE_POOL_ADDRESS = _aave_pool;
        manager = _manager;
        color = _color;
        name = _name;
    }


    // FIXME: Need to think how to manage startegy id --> 1? 
    //        What should we do when we remove one? 


    // mapping(strategyId => bool) activated;

    // IStrategy[] strategies; // address // Monitor start / end
                            // Have a full history of the actions --> bring trust in the process

    // FIXME:: Will need to check weird tokens!
    function supply(
        address asset,
        uint256 amount
    ) external {

        // TODO: Fees optimization ? 
        // 1. Create the account
        // 2. Call directly the AAVE contract and pass the vault address for the 'onBehalfOf'
        
        IERC20(asset).transferFrom(msg.sender, address(this), amount);

        IERC20(asset).approve(AAVE_POOL_ADDRESS, amount);

        IPool(AAVE_POOL_ADDRESS).supply(asset, amount, address(this), Manager(manager).getAaveReferralCode());

        
    }
    
        
    function withdraw(address asset, uint256 amount) external {
        // Withdraw the vault position and send back the token to the users
        IPool(AAVE_POOL_ADDRESS).withdraw(asset, amount, msg.sender);
    }

    
    function borrow(
        address asset, 
        uint256 amount, 
        uint256 interestRateMode
    ) external {
        // interestRateMode: 1 for Stable, 2 for Variable
        IPool(AAVE_POOL_ADDRESS).borrow(asset, amount, interestRateMode, Manager(manager).getAaveReferralCode(), address(this));

        // Send the token to the users
        // Isolate the debt in the smart contract
        IERC20(asset).transfer(msg.sender, amount);

        // FIXME: Send an event!
    }
    

    function repay(
        address asset,
        uint256 amount,
        uint256 interestRateMode
    ) external returns (uint256) {
                
        IERC20(asset).transferFrom(msg.sender, address(this), amount);

        IERC20(asset).approve(AAVE_POOL_ADDRESS, amount);

        return IPool(AAVE_POOL_ADDRESS).repay(asset, amount, interestRateMode, address(this));
    }



    function getReservesList() public view returns (address[] memory data) {
        return IPool(AAVE_POOL_ADDRESS).getReservesList();
    }



    
    uint256 public numberOfActivatedStrategies;

    address[] public strategies;
    bytes[] public strategyParams; 


    function hasStrategies() external view returns(bool) {
        return numberOfActivatedStrategies > 0;
    }

    function addStrategy(address strategyAddress, bytes memory params) external onlyOwner {
        strategies.push(strategyAddress);
        strategyParams.push(params);
        numberOfActivatedStrategies++;

        // FIXME: event please!
    }

    function removeStrategy(uint256 strategyId) external onlyOwner {
        // FIXME: custom error please
        require(strategyId < numberOfActivatedStrategies, "Invalid strategy ID");

        strategies[strategyId] = strategies[strategies.length - 1];
        strategyParams[strategyId] = strategyParams[strategyParams.length - 1];

        strategies.pop();
        strategyParams.pop();
        numberOfActivatedStrategies--;

        // FIXME: event
        // Emit an event for strategy removal
        // emit StrategyRemoved(strategyId);
    }

    function executeStrategies() external onlyManager {
        for (uint256 i = 0; i < strategies.length; i++) {
            
            // FIXME:
            // Do we need to approve a strategy?
            // Shoudl we remove a strategy or disable it?
            // What would make sense for the user?

            if (IStrategy(strategies[i]).isExecutable(strategyParams[i])) {
                IStrategy(strategies[i]).execute(strategyParams[i]);
            }
        }
    }


}
