// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;


interface IStrategy {

    // CUSTOM STORAGE ?? 

    function isExecutable(bytes memory data) external virtual view returns(bool);
    
    function execute(bytes memory data) external virtual returns(bool);

}