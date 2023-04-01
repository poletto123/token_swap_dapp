import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import BananaToken from '../abis/contracts/BananaToken.sol/BananaToken.json';
import TokenSwap from '../abis/contracts/TokenSwap.sol/TokenSwap.json';
import BuyForm from './BuyForm';
import SellForm from './SellForm';

const Main = ({ accounts }) => {

    const [accountBalance, setAccountBalance] = useState('');
    const [bananaBalance, setBananaBalance] = useState('');
    const [bananaContract, setBananaContract] = useState({});
    const [swapContract, setSwapContract] = useState({});
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [currentForm, setCurrentForm] = useState('buy');

    const bananaTokenAddress = '0xfcafA643eF33b1C388bA3aACe31D2899943A311B';
    const tokenSwapAddress = '0x4E6b04801c5890D8045B0D585f8AD6FD2a33C503';
    const tokenRate = 10;

    useEffect(() => {
        async function loadBlockchainData() {
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            let accountBalanceTemp = await provider.getBalance(accounts[0]);
            accountBalanceTemp = ethers.utils.formatEther(accountBalanceTemp);
            setAccountBalance(accountBalanceTemp);

            let bananaContractTemp = new ethers.Contract(bananaTokenAddress, BananaToken.abi, provider.getSigner(accounts[0]));
            setBananaContract(bananaContractTemp);

            let bananaBalanceTemp = await bananaContractTemp.balanceOf(accounts[0]);
            bananaBalanceTemp = ethers.utils.formatEther(bananaBalanceTemp);
            setBananaBalance(bananaBalanceTemp);

            let swapContractTemp = new ethers.Contract(tokenSwapAddress, TokenSwap.abi, provider.getSigner(accounts[0]));
            setSwapContract(swapContractTemp);
        }
        if (accounts[0]) {
            loadBlockchainData();
        }
    }, [accounts, bananaContract]);

    let content;
    if (currentForm === 'buy') {
        content = <BuyForm
            accountBalance={accountBalance}
            bananaBalance={bananaBalance}
            swapContract={swapContract}
            input={input}
            setInput={setInput}
            setOutput={setOutput}
            output={output}
            tokenRate={tokenRate}
        />
    } else {
        content = <SellForm
            accountBalance={accountBalance}
            bananaBalance={bananaBalance}
            bananaContract={bananaContract}
            swapContract={swapContract}
            input={input}
            setInput={setInput}
            setOutput={setOutput}
            output={output}
            tokenRate={tokenRate}
        />
    }
    return (
        <div>
            {accounts[0] ? (
                <div id="content" className="mt-3">

                    <div className="d-flex justify-content-between mb-3">
                        <button
                            className="btn btn-light"
                            onClick={() => {
                                setCurrentForm('buy');
                            }}
                        >
                            Buy
                        </button>
                        <span className="text-muted">&lt; &nbsp; &gt;</span>
                        <button
                            className="btn btn-light"
                            onClick={() => {
                                setCurrentForm('sell');
                            }}
                        >
                            Sell
                        </button>
                    </div>

                    <div className="card mb-4">
                        <div className="card-body">
                            {content}
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