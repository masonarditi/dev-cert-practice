// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Count {
    uint256 public count;
    address public owner;

    event CountIncremented(uint256 count);
    event CountDecremented(uint256 count);

    constructor() {
        owner = msg.sender;
        count = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function increment() public onlyOwner {
        count++;
        emit CountIncremented(count);
    }

    function decrement() public onlyOwner {
        count--;
        require(count >= 0, "Count cannot be negative");
        emit CountDecremented(count);
    }

    function getCount() public view returns (uint256) {
        return count;
    }
}

