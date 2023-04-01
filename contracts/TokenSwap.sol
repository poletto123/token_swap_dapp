//SPDX-License-Identifier: MIT

import './BananaToken.sol';

pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract TokenSwap {
    string public name = "TokenSwap";
    BananaToken public bananaToken;
    uint public rate = 10;

    event TokensPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor (BananaToken _bananaToken) {
        bananaToken = _bananaToken;
    }

    function buyTokens() public payable {
        uint tokenAmount = msg.value * rate;
        require(bananaToken.balanceOf(address(this)) >= tokenAmount, "Not enough tokens");
        bananaToken.transfer(msg.sender, tokenAmount);
        emit TokensPurchased(msg.sender, address(bananaToken), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public {
        require(bananaToken.balanceOf(msg.sender) >= _amount);
        console.log(bananaToken.balanceOf(msg.sender));
        console.log(_amount, rate);
        uint etherAmount = _amount / rate;
        console.log(etherAmount);
        require(address(this).balance >= etherAmount);
        console.log(address(this).balance);
        bananaToken.transferFrom(msg.sender, address(this), _amount);
        payable(msg.sender).transfer(etherAmount);
        console.log(bananaToken.balanceOf(msg.sender));
        console.log(address(this).balance);
        console.log(msg.sender.balance);
        emit TokensSold(msg.sender, address(bananaToken), _amount, rate);
    }
}