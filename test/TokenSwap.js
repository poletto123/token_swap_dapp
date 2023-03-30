const { ethers } = require('hardhat');
const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

describe('TokenSwap', function() {
    async function deployBananaTokenAndTokenSwap() {
        const BananaToken = await ethers.getContractFactory("BananaToken");
        const bananaToken = await BananaToken.deploy();
        await bananaToken.deployed();
      
        const TokenSwap = await ethers.getContractFactory("TokenSwap");
        const tokenSwap = await TokenSwap.deploy(bananaToken.address);
        await tokenSwap.deployed();

        return { tokenSwap, bananaToken };
    }

    it('sends tokens to tokenSwap address', async () => {
        const { tokenSwap, bananaToken } = await loadFixture(deployBananaTokenAndTokenSwap);
        await bananaToken.transfer(tokenSwap.address, ethers.utils.parseEther("1"));
        expect(await bananaToken.balanceOf(tokenSwap.address)).to.equal(ethers.utils.parseEther("1"));
    })

    it('allows for buying tokens for a fixed price', async () => {
        const { tokenSwap, bananaToken } = await loadFixture(deployBananaTokenAndTokenSwap);
        const [deployer, investor] = await ethers.getSigners();
        await bananaToken.transfer(tokenSwap.address, ethers.utils.parseEther('1'));
        await tokenSwap.connect(investor).buyTokens({ value: ethers.utils.parseUnits('1000000', 'wei')});
        expect(await bananaToken.balanceOf(investor.address)).to.equal(ethers.utils.parseUnits('100000000', 'wei'));
    })
});