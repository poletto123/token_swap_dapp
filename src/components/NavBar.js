import React, { useEffect } from 'react';
import Identicon from 'identicon.js';

const NavBar = ({ accounts, setAccounts }) => {
    const isConnected = Boolean(accounts[0]);

    useEffect(() => {
        if (isConnected) {
            console.log(accounts);
        }
    }, [accounts, isConnected]);

    async function connectAccount() {
        if (window.ethereum) {
            const addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccounts(addresses);
        }
    }

    return (
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a className="navbar-brand col-sm-3 col-md-2 mr-0"
                href="https://github.com/poletto123/token_swap_solidity"
                target="_blank"
                rel="noopener noreferrer"
            >
                TokenSwap
            </a>

            <div >
                {isConnected ? (
                    <ul className="navbar-nav px-3">
                        <li className="nav-item text-nowrap d-none d-sm-block">
                            <small className="text-secondary">
                                <small id="account">{accounts[0]}</small>
                            </small>
                            <img
                                className="ml-2"
                                width='30'
                                height='30'
                                src={`data:image/png;base64,${new Identicon(accounts[0], 30).toString()}`}
                                alt=""
                            />

                        </li>
                    </ul>
                ) : (
                    <button
                        onClick={connectAccount}
                    >
                        Connect
                    </button>

                )}
            </div>
        </nav>
    );
}

export default NavBar;