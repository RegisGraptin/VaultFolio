// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import {IPool} from 'aave-v3-core/contracts/protocol/pool/Pool.sol';

// Understand proxy pattern
// Add different strategy based on the user needs




// contract SwapReward is IStrategy {
//     // Once I earn more than 5% 
//     // Swap the reward to another assets





contract Vault is Ownable {
    /// Logic of the smart contract
    /// It should store all the representation value of AAVE, meaning the aToken 
    /// from a lending position or the debt token from a borrowing position.
    /// 
    /// All the liqudity should remained to the user.


    address immutable public AAVE_POOL_ADDRESS;

    uint16 immutable public REFERRAL_CODE = 0; // FIXME: visibility ?

    uint8 public color;
    string public name;
    

    // FIXME: Naming nomenclature
    constructor(
        address _aave_pool,
        address owner,
        uint8 _color,
        string memory _name
    ) Ownable(owner) {
        AAVE_POOL_ADDRESS = _aave_pool;
        color = _color;
        name = _name;
    }


    // FIXME: Need to think how to manage startegy id --> 1? 
    //        What should we do when we remove one? 


    // mapping(strategyId => bool) activated;

    bytes[] strategyParams; 
    address[] strategies;

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

        IPool(AAVE_POOL_ADDRESS).supply(asset, amount, address(this), REFERRAL_CODE);

        // Notice the wraped token stays in the vault
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
        IPool(AAVE_POOL_ADDRESS).borrow(asset, amount, interestRateMode, REFERRAL_CODE, address(this));

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

    function registerStrategy(address strategy, bytes memory params) external {
        // FIXME:
    }


    function executeStrategy(uint256 id) external {
        // require(IStrategy(strategies[id]).isExecutable(), 'STRATEGY_CANNOT_BE_RUN');
        // IStrategy(strategies[id]).execute();


        strategies[id].delegatecall(
            abi.encodeWithSignature('execute(bytes)', strategyParams[id])
        );

    }




    // Can have multiple one! 
    uint256 public nextExecutionTime;


    function addStrategy(address strategyAddress) external onlyOwner {
        strategies.push(strategyAddress);
        // approvedStrategies[strategyAddress] = true;
        if (nextExecutionTime == 0) {
            nextExecutionTime = block.timestamp + 1 weeks;
        }
    }

    function executeStrategies() external onlyManager {
        for (uint256 i = 0; i < strategies.length; i++) {
            if (approvedStrategies[strategies[i]]) {
                IStrategy(strategies[i]).execute(address(this));
            }
        }
    }


}
