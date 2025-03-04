// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;


interface IStrategy {

    function isExecutable(bytes memory data) external view returns(bool);
    
    function execute(bytes memory data) external returns(bool);

}