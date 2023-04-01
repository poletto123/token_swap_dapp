import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import BananaToken from '../abis/BananaToken.json';
import TokenSwap from '../abis/TokenSwap.json';
import ethLogo from '../assets/ethLogo.png';
import bananaLogo from '../assets/bananaToken.png';

const Main = ({ accounts }) => {

    const [accountBalance, setAccountBalance] = useState('');
    const [bananaBalance, setBananaBalance] = useState('');
    const [bananaContract, setBananaContract] = useState({});
    const [swapContract, setSwapContract] = useState({});
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const bananaTokenAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const tokenSwapAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
    const tokenRate = 100;


    useEffect(() => {
        async function loadBlockchainData() {
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            let accountBalanceTemp = await provider.getBalance(accounts[0]);
            accountBalanceTemp = ethers.utils.formatEther(accountBalanceTemp);
            setAccountBalance(accountBalanceTemp);

            let bananaContractTemp = new ethers.Contract(bananaTokenAddress, BananaToken.abi, provider.getSigner(accounts[0]));
            setBananaContract(bananaContractTemp);

            let bananaBalanceTemp = await bananaContractTemp.balanceOf(accounts[0]);
            bananaBalanceTemp = bananaBalanceTemp.toString();
            setBananaBalance(bananaBalanceTemp);

            let swapContractTemp = new ethers.Contract(tokenSwapAddress, TokenSwap.abi, provider.getSigner(accounts[0]));
            setSwapContract(swapContractTemp);
        }
        if (accounts[0]) {
            loadBlockchainData();
        }
    }, [accounts, bananaContract]);

    async function buyTokens(etherAmount) {
        let amount = ethers.utils.parseEther((etherAmount)).toString();
        const response = await swapContract.buyTokens({ value: amount });
        console.log(response);
    }


    return (
        <div>
            {accounts[0] ? (
                <div id="content">
                    <div className="card mb-4">
                        <div className="card-body">
                            <form className="mb-3" onSubmit={(event) => {
                                event.preventDefault();
                                buyTokens(input);
                            }}>
                                <div className="input-balance-container">
                                    <label className="float-left"><b>Input</b></label>
                                    <span className="float-right text-muted">
                                        Balance: {accountBalance}
                                    </span>
                                </div>
                                <div className="input-group mb-4">
                                    <input
                                        className="form-control form-control-lg"
                                        onChange={(event) => {
                                            const etherAmount = event.target.value;
                                            setOutput(etherAmount * tokenRate);
                                            setInput(etherAmount);
                                        }}
                                        type="text"
                                        placeholder="0"
                                        value={input}
                                        required />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <img src={ethLogo} height='32' alt="" />
                                            &nbsp;&nbsp;&nbsp; ETH
                                        </div>
                                    </div>
                                </div>

                                <div className="input-balance-container">
                                    <label className="float-left"><b>Output</b></label>
                                    <span className="float-right text-muted">
                                        Balance: {bananaBalance}
                                    </span>
                                </div>
                                <div className="input-group mb-2">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        placeholder="0"
                                        value={output}
                                        disabled
                                    />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <img src={bananaLogo} height='32' alt="" />
                                            &nbsp; BANANA
                                        </div>
                                    </div>
                                </div>
                                <div className="input-balance-container mb-5">
                                    <span className="float-left text-muted">Exchange Rate</span>
                                    <span className="float-right text-muted">1 ETH = 100 BANANA</span>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP!</button>
                            </form>
                        </div>
                    </div >
                </div >
            ) : (
                <div></div>
            )}
        </div >
    );
}

export default Main;