import React from 'react';
import { ethers } from "ethers";
import ethLogo from '../assets/ethLogo.png';
import bananaLogo from '../assets/bananaToken.png';

const SellForm = ({ 
    accountBalance,
    bananaBalance,
    bananaContract,
    swapContract,
    input,
    setInput,
    output,
    setOutput,
    tokenRate
 }) => {

    async function sellTokens(tokenAmount) {
        let amount = ethers.utils.parseEther((tokenAmount)).toString();
        console.log(amount);
        await bananaContract.approve(swapContract.address, amount, { gasLimit: 200000 });
        const response = await swapContract.sellTokens(amount, { gasLimit: 200000 });
        console.log(response);
    }


    return (
        <div>
            <form className="mb-3" onSubmit={(event) => {
                event.preventDefault();
                sellTokens(input);
            }}>
                <div className="input-balance-container">
                    <label className="float-left"><b>Input</b></label>
                    <span className="float-right text-muted">
                        Balance: {bananaBalance}
                    </span>
                </div>
                <div className="input-group mb-4">
                    <input
                        className="form-control form-control-lg"
                        onChange={(event) => {
                            const tokenAmount = event.target.value;
                            setOutput(tokenAmount / tokenRate);
                            setInput(tokenAmount);
                        }}
                        type="text"
                        placeholder="0"
                        value={input}
                        required />
                    <div className="input-group-append">
                        <div className="input-group-text">
                            <img src={bananaLogo} height='32' alt="" />
                            BANANA
                        </div>
                    </div>
                </div>

                <div className="input-balance-container">
                    <label className="float-left"><b>Output</b></label>
                    <span className="float-right text-muted">
                        Balance: {accountBalance}
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
                            <img src={ethLogo} height='32' alt="" />
                            ETH
                        </div>
                    </div>
                </div>
                <div className="input-balance-container mb-5">
                    <span className="float-left text-muted">Exchange Rate</span>
                    <span className="float-right text-muted">10 BANANA = 1 ETH</span>
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP!</button>
            </form>
        </div >
    );
}

export default SellForm;