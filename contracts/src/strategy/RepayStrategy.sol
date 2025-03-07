// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.28;

// import {IPool} from 'aave-v3-core/contracts/protocol/pool/Pool.sol';
// import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


// import {IStrategy} from "../interfaces/IStrategy.sol";

// // Use 95% of reward to repay

// struct RepayParams {
//     address protocol;
//     address asset;
//     uint256 above;
//     uint256 percent;
//     uint256 afterTime;
//     uint256 interestRateMode;
// }

// contract RepayStrategy is IStrategy {

//     // Repay do we need a swap? 
//     //  https://aave.com/docs/developers/smart-contracts/switch-adapters

//     uint256 public strategyId;

    

//     function subscribe(bytes memory params) external {

//     }


//     function isExecutable(bytes memory data) external override view returns(bool) {
//         return true;
//     }
    
//     function execute(bytes memory data) external override returns(bool) {
//         (address protocol, address asset, uint256 above, uint256 percent, uint256 afterTime, uint256 interestRateMode) = abi.decode(data, (address, address, uint256, uint256, uint256, uint256));
//         require(block.timestamp > afterTime, "NOT_ENOUGH_TIME");
        
//         if (IERC20(asset).balanceOf(address(this)) <= above) {
//             return false;
//         }

//         uint256 rewards = IERC20(asset).balanceOf(address(this)) - above;
//         uint256 repayAmount = (percent * rewards) / 100_000;

//         IPool(protocol).repay(asset, repayAmount, interestRateMode, address(this)); // Vault.AAVE_POOL_ADDRESS 

//         // return block.timestamp;
//         return true;
//     }

//     // FIXME: resync strategies when vault storage value changes??

// }