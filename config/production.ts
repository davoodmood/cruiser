require('dotenv').config()

enum network {
    ethereum,
    bsc,
    matic,
    arbitrum,
    avalanche,
    fantom,
    bscTestnet,
    polygonTestnet,
}

const NETWORK = process.env.NETWORK || network.bsc;
const CONTRACT_ADDRESS = "0x361161Ed659549b31cCa203174BE93bf2bD95c96"
const RPC_URL = process.env.RPC_URL || `https://speedy-nodes-nyc.moralis.io/${process?.env?.RPC_API_KEY}/bsc/testnet`;


const isDemo: boolean = true; // default if .env is not set.
const PRIVATE_KEY = ''