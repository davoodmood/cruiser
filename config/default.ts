require('dotenv').config()
import { Wallet } from "ethers";
import { Mnemonic } from "ethers/lib/utils";

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
const mnemonic: string = process.env.MNEMONIC || `${Wallet.createRandom().mnemonic}`;

export const NETWORK = process.env.NETWORK || network.bsc;
export const CONTRACT_ADDRESS = "0x361161Ed659549b31cCa203174BE93bf2bD95c96";
export const RPC_URL = process.env.RPC_URL || `https://speedy-nodes-nyc.moralis.io/${process?.env?.RPC_API_KEY}/bsc/testnet`;

export const isDemo: boolean = true; // default if .env is not set.
export const PRIVATE_KEY = process.env.PRIVATE_KEY || Wallet.fromMnemonic(mnemonic).privateKey;
export const MNEMONIC = mnemonic;