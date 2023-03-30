//SPDX-License-Identifier: MIT

import './BananaToken.sol';

pragma solidity ^0.8.9;

contract TokenSwap {
    string public name = "TokenSwap";
    BananaToken public bananaToken;
    uint public rate = 100;

    constructor (BananaToken _bananaToken) {
        bananaToken = _bananaToken;
    }

    function buyTokens() public payable {
        uint tokenAmount = msg.value * rate;
        bananaToken.transfer(msg.sender, tokenAmount);
    }

}