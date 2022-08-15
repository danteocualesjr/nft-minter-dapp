import { pinJSONToIPFS } from './pinata.js';
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
}

export const mintNFT = async (url, name, description) => {

    // Error handling

    if (url.trim() == "" || (name.trim() == "" || description.trim() == "")) {
        return {
            success: false,
        }
            status: "❗ Please make sure to complete all fields before minting.",
    }

    // Make metadata

    const metadata = new Object();
    metadata.name = name;
    metadata.image = url;
    metadata.description = description;

    // Pinata pin request  
      
    const pinataResponse = await pinJSONToIPFS(metadata);
    if (!pinataResponse.success) {
        return {
            success: false,
            status: "😢 Something went wrong while uploading your tokenURI.",
        }
    }
    const tokenURI = pinataResponse.pinataUrl;

    // For loading smart contract
    
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);

    // Setting up Ethereum transaction

    const transactionParameters = {
        to: contractAddress, // Required except during contract publications
        from: window.ethereum.selectedAddress, // Must match user's active address
        'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI() // Make call to NFT smart contract
    
    };

    // Sign the transaction via MetaMask
    
    try {
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
        }
    }   catch (error) {
            return {
                success: false,
                status: "😥 Something went wrong: " + error.message
            }
    }
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