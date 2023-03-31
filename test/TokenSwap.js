const { ethers } = require('hardhat');
const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

describe('TokenSwap', function() {
    async function deployContractsAndSendFundsToTokenSwap() {
        const BananaToken = await ethers.getContractFactory("BananaToken");
        const bananaToken = await BananaToken.deploy();
        await bananaToken.deployed();
      
        const TokenSwap = await ethers.getContractFactory("TokenSwap");
        const tokenSwap = await TokenSwap.deploy(bananaToken.address);
        await tokenSwap.deployed();

        await bananaToken.transfer(tokenSwap.address, ethers.utils.parseEther("1"));

        return { tokenSwap, bananaToken };
    }

    it('sends tokens to tokenSwap address', async () => {
        const { tokenSwap, bananaToken } = await loadFixture(deployContractsAndSendFundsToTokenSwap);
        expect(await bananaToken.balanceOf(tokenSwap.address)).to.equal(ethers.utils.parseEther("1"));
    })

    it('allows for buying tokens for a fixed price', async () => {
        const { tokenSwap, bananaToken } = await loadFixture(deployContractsAndSendFundsToTokenSwap);
        const [deployer, investor] = await ethers.getSigners();
        const provider = ethers.provider;

        await expect(tokenSwap.connect(investor).buyTokens({ value: ethers.utils.parseUnits('1000000', 'wei')}))
            .to.emit(tokenSwap, 'TokensPurchased').withArgs(
                investor.address, 
                bananaToken.address,
                ethers.utils.parseUnits('100000000', 'wei'),
                '100');

        expect(await bananaToken.balanceOf(investor.address)).to.equal(ethers.utils.parseUnits('100000000', 'wei'));
        expect(await provider.getBalance(tokenSwap.address)).to.equal(ethers.utils.parseUnits('1000000', 'wei'));
    })

    it('allows for selling tokens for a fixed price', async () => {
        const { tokenSwap, bananaToken } = await loadFixture(deployContractsAndSendFundsToTokenSwap);
        const [deployer, investor] = await ethers.getSigners();
        const provider = ethers.provider;

        expect(await bananaToken.balanceOf(investor.address)).to.equal(0);
        expect(await bananaToken.balanceOf(tokenSwap.address)).to.equal(ethers.utils.parseEther("1"));
        expect(await provider.getBalance(tokenSwap.address)).to.equal(0);

        await tokenSwap.connect(investor).buyTokens({ value: ethers.utils.parseUnits('10', 'wei')});
        await bananaToken.connect(investor).approve(tokenSwap.address, ethers.utils.parseUnits('1000', 'wei'));
        await expect(tokenSwap.connect(investor).sellTokens(ethers.utils.parseUnits('1000', 'wei')))
            .to.emit(tokenSwap, 'TokensSold').withArgs(
                investor.address, 
                bananaToken.address,
                ethers.utils.parseUnits('1000', 'wei'),
                '100'
            );;
        expect(await bananaToken.balanceOf(investor.address)).to.equal(0);
        expect(await bananaToken.balanceOf(tokenSwap.address)).to.equal(ethers.utils.parseEther("1"));
        expect(await provider.getBalance(tokenSwap.address)).to.equal(0);
    })

    it("doesn't allow for user to sell more tokens than they have", async() => {
        const { tokenSwap, bananaToken } = await loadFixture(deployContractsAndSendFundsToTokenSwap);
        const [deployer, investor] = await ethers.getSigners();

        expect(await bananaToken.balanceOf(investor.address)).to.equal(0);
        await expect(tokenSwap.connect(investor).sellTokens(ethers.utils.parseUnits('1000', 'wei'))).to.be.reverted;
    })
});