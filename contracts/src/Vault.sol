// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";



// Understand proxy pattern
// Add different strategy based on the user needs


contract Vault is Ownable {

    constructor(address owner) Ownable(owner) {}


    function supply() external {}
    
    
    function borrow() external {}
    
    
    function withdraw() external {}


    // TODO: Is it needed?
    // function repay() external {}


    // TODO:: Strategies ?

    // Q: How does yield works ? 

    // On AAVE - supply 1:1 token:aToken
    // Distribution => Increase user balance

    // Keeper - 10 days
    // - Automate reward to repay yield
    // - Automate reward to buy other kind of assets


    // How to reduce entry barrier
    // => Do not want to pay fees for each market action

    // FIXME: Front-end side --> Show all the history for all the action of the vault!
    

    // Different strategies

}
