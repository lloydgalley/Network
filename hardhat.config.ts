import type { HardhatUserConfig, NetworkUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-truffle5";
import "hardhat-abi-exporter";
import "hardhat-contract-sizer";
import "solidity-coverage";
import "dotenv/config";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-change-network";

// const bscTestnet: NetworkUserConfig = {
//   url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
//   chainId: 97,
//   accounts: [process.env.KEY_TESTNET!],
// };



const homeMainnet: NetworkUserConfig = {
  url: 'http://localhost:8545',
  chainId: 651940,
  accounts: [process.env.KEY_MAINNET!],
};

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // gas: 120000000,
      // blockGasLimit: 0x1fffffffffffff,
    },
    // testnet: bscTestnet,
    homeMainnet,
  },
  // etherscan: {
  //   apiKey: {
  //     homeMainnet:'123',
  //   },
  //   customChains: [
  //     {
  //       network: "homeMainnet",
  //       chainId: 32344,
  //       urls: {
  //         apiURL: 'https://explorer.tlchain.live/api',
  //         browserURL: 'https://explorer.tlchain.live',
  //       },
  //     }
  //   ],
  // },
  solidity: {
    compilers: [
      {
        version: "0.4.26",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  abiExporter: {
    path: "./data/abi",
    clear: true,
    flat: false,
  },
};

export default config;
