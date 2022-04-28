// import config from "config";
const config = require("config");
import { Contract, providers, utils, Wallet } from "ethers";
import cruiserDemoABI from "../abi/cruiser_test_abi.json";
import _ from "lodash";

export let provider: providers.JsonRpcProvider | providers.WebSocketProvider;
const private_key = config.get("PRIVATE_KEY") as string;
const mnemonic = config.get("MNEMONIC") as string;
const isDemo = config.get("isDemo") as boolean;
const cruiserAddress = config.get("CONTRACT_ADDRESS") as string;
const rpc_url = config.get("RPC_URL") as string;
const network = config.get("NETWORK") as number;
console.log("Cruiser Test ABI first Func: ", cruiserDemoABI[0].name );

// if (private_key === "") {
//     console.warn("Must provide PRIVATE_KEY environment variable")
//     process.exit(1)
// }
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

const wallet: Wallet = private_key.length > 0 ? 
    new Wallet(private_key.trim()):
    Wallet.fromMnemonic(mnemonic.trim());

const signingWallet = wallet.connect(provider);

const options = { gasLimit: 24531 , gasPrice: 9900000000000 };
const contract: Contract = new Contract(cruiserAddress, cruiserDemoABI, signingWallet);

async function main() {
    console.log("Wallet Address: " + await signingWallet.getAddress());
    provider.on('block', async (_blockNumber: number) => {
        console.time(`Execution Time - Block #${_blockNumber}`);
        const now = new Date().getTime() / 1000;
        let {timestamp} = await provider.getBlock(_blockNumber);
        const clientDiff = now - timestamp;
        
        if ( (0 < clientDiff && clientDiff < 2.7) || (0 < clientDiff % 3) && (clientDiff % 3 < 2.7) ) {
            // const estimateGas: any = await contract.shell().provider.estimateGas();
            // options.gasLimit = estimateGas.mul(2);
            
            try {
                const tx = await contract.shell(options);
            
                const rc = await tx.wait();
                const res = rc.events.find((event: { event: string; }) => event.event === 'Stamped');
                const [blockTimestamp, blocknumber, msg] = res.args;
                if (res) {
                    console.timeEnd(`Execution Time - Block #${_blockNumber}`);
                    const cruiserDiff = blockTimestamp.toNumber() - now;
                    console.log(`Data & current time ${msg}: 
                    Block Number: ${_blockNumber} 
                    Shelled Block Number: #${blocknumber.toString()}
                    Block TimeStamp: ${timestamp} (${new Date(timestamp * 1000)})
                    Client TimeStamp: ${now} (${new Date(now * 1000)})
                    Shelled Block TimeStamp: ${blockTimestamp.toString()} (${new Date(blockTimestamp.toNumber() * 1000)})
                    Client Time Diff (Sec.): ${clientDiff} 
                    Shelled/Cruiser Time Diff (Sec.): ${cruiserDiff}
                    Cruiser Action Duration = Execution Time
                    
                    `);
                };
            } catch (error: any) {
                // console.log(error.error.code, " ", error.error.message)
                switch (error.error.message) {
                    case "already known":
                        console.log(
                            "%cPrevious transaction is still in the Mempool!\n\n",
                            "color:yellow;font-family:system-ui;font-size:12px;-webkit-text-stroke: 1px gray;font-weight:bold"
                        );
                        break;
                    case "insufficient funds for gas * price + value": 
                        console.log(
                            "%cYour wallet doesn't have enough fund.\n\n",
                            "background-color:yellow; color:white; font-family:system-ui;font-size:12px;-webkit-text-stroke: 1px gray;font-weight:bold"
                        );
                        break;
                    default:
                        console.log("Error Code: ", error.error.code, " Message: ", error.error.message);
                        console.log( error.error.code, error.error.message, "\n\n")
                        break;
                }
            }
        } else {
            // console.timeEnd(`Execution Time - Block #${_blockNumber}`);
        }
    });
}

main();



