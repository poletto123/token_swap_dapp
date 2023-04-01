//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract BananaToken is ERC20 {
    uint256 public _totalSupply = 10000 ether;

    constructor() ERC20("BananaToken", "BANANA") {
        _mint(msg.sender, _totalSupply);
    }

}