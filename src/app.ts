import config from "config";
import { Contract, providers, Wallet } from "ethers";
import cruiserDemoABI from "../abi/cruiser_test_abi.json";
import _ from "lodash";

export let provider: providers.JsonRpcProvider | providers.WebSocketProvider;
const private_key = config.get("PRIVATE_KEY") as string;
const mnemonic = config.get("MNEMONIC") as string;
const network = config.get("NETWORK") as number;
const isDemo = config.get("isDemo") as boolean;
const cruiserAddress = config.get("CONTRACT_ADDRESS") as string;
const rpc_url = config.get("RPC_URL") as string;
console.log("Cruiser Test ABI first Func: ", cruiserDemoABI[0].name );

if (private_key === "") {
    console.warn("Must provide PRIVATE_KEY environment variable")
    process.exit(1)
}
// if (BUNDLE_EXECUTOR_ADDRESS === "") {
//     console.warn("Must provide BUNDLE_EXECUTOR_ADDRESS environment variable. Please see README.md")
//     process.exit(1)
// }

if (rpc_url.includes("https://speedy")) {
    provider = new providers.JsonRpcProvider(rpc_url);
} else if (rpc_url.includes("wss")) {
    provider = new providers.WebSocketProvider(rpc_url);
} else {
    provider = new providers.JsonRpcProvider(
        isDemo ? 
        'https://data-seed-prebsc-1-s1.binance.org:8545/' :
        'https://bsc-dataseed.binance.org/'
        , 
        { name: 'binance', chainId: isDemo ? 97 : 56 }
    );
}

const signingWallet: Wallet = private_key.length > 0 ? 
    new Wallet(private_key.trim()):
    Wallet.fromMnemonic(mnemonic.trim());
const contract: Contract = new Contract(cruiserAddress, cruiserDemoABI, provider)

async function main() {
    console.log("Wallet Address: " + await signingWallet.getAddress());
    provider.on('block', async (_blockNumber: number) => {
        let {timestamp} = await provider.getBlock(_blockNumber);
        const now = new Date().getTime() / 1000;

        console.log("block data & current time: ", `
            Block Number: ${_blockNumber}
            Block Number: ${timestamp} (${new Date(timestamp * 1000)})
            Block Number: ${now} (${new Date(now * 1000)})
        `);
    });
}

main();



