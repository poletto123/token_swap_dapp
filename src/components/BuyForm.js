import React from 'react';
import { ethers } from "ethers";
import ethLogo from '../assets/ethLogo.png';
import bananaLogo from '../assets/bananaToken.png';

const BuyForm = ({ 
    accountBalance,
    bananaBalance,
    swapContract,
    input,
    setInput,
    output,
    setOutput,
    tokenRate
 }) => {

    async function buyTokens(etherAmount) {
        let amount = ethers.utils.parseEther((etherAmount)).toString();
        const response = await swapContract.buyTokens({ value: amount, gasLimit: 200000 });
        console.log(response);
    }


    return (
        <div>
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
                    <span className="float-right text-muted">1 ETH = 10 BANANA</span>
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP!</button>
            </form>
        </div >
    );
}

export default BuyForm;