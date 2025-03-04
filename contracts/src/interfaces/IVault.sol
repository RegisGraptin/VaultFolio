// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;



// FIXME: rename to speciifyc stratgies
interface IVault {


    // FIXME: Shoudl we have another interfce dedicated to potential execute stragegy?
    //       Or should we have a single interface that can be used for both?
    // => Need to think more on the archtiecture
    function hasStrategies() external view returns(bool);

    // Can be executed
    
    function addStrategy(address strategyAddress) external;
    
    function removeStrategy(uint256 strategyId) external;
    
    function executeStrategies() external;

}