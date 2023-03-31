//SPDX-License-Identifier: MIT

import './BananaToken.sol';

pragma solidity ^0.8.9;

contract TokenSwap {
    string public name = "TokenSwap";
    BananaToken public bananaToken;
    uint public rate = 100;

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
        require(bananaToken.balanceOf(address(this)) >= tokenAmount);
        bananaToken.transfer(msg.sender, tokenAmount);
        emit TokensPurchased(msg.sender, address(bananaToken), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public {
        require(bananaToken.balanceOf(msg.sender) >= _amount);
        uint etherAmount = _amount / rate;
        require(address(this).balance >= etherAmount);
        bananaToken.transferFrom(msg.sender, address(this), _amount);
        payable(msg.sender).transfer(etherAmount);
        emit TokensSold(msg.sender, address(bananaToken), _amount, rate);
    }
}