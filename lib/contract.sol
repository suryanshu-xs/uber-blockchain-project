// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;
contract UberContract {

    event Message(string message);
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }
    function withdraw() public {
        require(msg.sender == owner,"You are not the owner of this contract!");
        payable(msg.sender).transfer(address(this).balance);
    }

    function deposit() payable public {
        emit Message("Your ride is on the way!");
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

}