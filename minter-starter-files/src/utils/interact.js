require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../contract-abi.json');
const contractAddress = "0xe8b00e6d6de63a9c4d3d3b881d2199505eb03c5c";

export const connectWallet = async () => {
    if (window.ethereum) {
        try { 
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                status : "👆🏽 Write a message in the text field above.",
                address: addressArray[0],
            };
            return obj;
         } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
         }
    }   else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊 {" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install MetaMask, a virtual Ethereum wallet, in your browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};

export const mintNFT = async (url, name, description) => {
    
}

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth.accounts",
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "👆🏽 Write a message in the text field above.",
                };
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to MetaMask using the top-right button.",
                };
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target ="_blank" href={`https://metamask.io/download.html`}>
                            You must install MetaMask, a virtual Ethereum wallet, in your browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};