import { ethers } from "hardhat";

async function main() {
  const BananaToken = await ethers.getContractFactory("BananaToken");
  const bananaToken = await BananaToken.deploy();
  await bananaToken.deployed();
  console.log("BananaToken address: ", bananaToken.address);

  const TokenSwap = await ethers.getContractFactory("TokenSwap");
  const tokenSwap = await TokenSwap.deploy(bananaToken.address);
  await tokenSwap.deployed();
  console.log("TokenSwap address: ", tokenSwap.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
