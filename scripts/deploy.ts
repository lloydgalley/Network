import { ethers, network, web3 } from "hardhat";
import { deferPromise, verify } from "./utils/utils";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log("\nDeploy Consensus ")
    const {toBN, toWei} = web3.utils

    const EternalStorageProxy = await ethers.getContractFactory("EternalStorageProxy");
    const BlockReward = await ethers.getContractFactory("BlockReward");
    const Consensus = await ethers.getContractFactory("Consensus");
    const ProxyStorage = await ethers.getContractFactory("ProxyStorage");
    const Voting = await ethers.getContractFactory("Voting");
    
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

    const {
      INITIAL_VALIDATOR_ADDRESS,
      INITIAL_SUPPLY_GWEI,
      SAVE_TO_FILE,
      DEBUG
    } = process.env

    let initialValidatorAddress = INITIAL_VALIDATOR_ADDRESS || ZERO_ADDRESS
    let initialSupply = web3.utils.toWei(INITIAL_SUPPLY_GWEI?.toString(), 'gwei')
    let proxy
    let blockReward, blockRewardImpl
    let consensus, consensusImpl
    let proxyStorage, proxyStorageImpl
    let voting, votingImpl

      // Consensus
      // Consensus

    consensusImpl = await Consensus.deploy()
    await deferPromise(8000);
    console.log(`consensusImpl: ${consensusImpl.address}`)

    proxy = await EternalStorageProxy.deploy(ZERO_ADDRESS, consensusImpl.address)
    await deferPromise(8000);
    console.log(`proxy: ${proxy.address}`)
    consensus = await Consensus.attach(proxy.address)
    await deferPromise(8000);
    console.log(`consensus: ${consensus.address}`)
    await consensus.initialize(initialValidatorAddress)
    await deferPromise(8000);
    console.log(`consensus.initialize: ${initialValidatorAddress}`)


      // ProxyStorage
    proxyStorageImpl = await ProxyStorage.deploy()
    await deferPromise(8000);

    console.log(`proxyStorageImpl: ${proxyStorageImpl.address}`)
    proxy = await EternalStorageProxy.deploy(ZERO_ADDRESS, proxyStorageImpl.address)
    await deferPromise(8000);

    console.log(`proxy: ${proxy.address}`)
    proxyStorage = await ProxyStorage.attach(proxy.address)
    await deferPromise(8000);

    console.log(`proxyStorage: ${proxyStorage.address}`)
    await proxyStorage.initialize(consensus.address)
    await deferPromise(8000);

    console.log(`proxyStorage.initialize: ${consensus.address}`)
    await consensus.setProxyStorage(proxyStorage.address)
    await deferPromise(8000);

    console.log(`consensus.setProxyStorage: ${proxyStorage.address}`)

    // BlockReward
    blockRewardImpl = await BlockReward.deploy()
    await deferPromise(8000);
    console.log(`blockRewardImpl: ${blockRewardImpl.address}`)
    proxy = await EternalStorageProxy.deploy(proxyStorage.address, blockRewardImpl.address)
    await deferPromise(8000);
    console.log(`proxy: ${proxy.address}`)
    blockReward = await BlockReward.attach(proxy.address)
    await deferPromise(8000);
    console.log(`blockReward: ${blockReward.address}`)
    await blockReward.initialize(initialSupply)
    await deferPromise(8000);
    console.log(`blockReward.initialize: ${initialSupply}`)

    // Voting
    votingImpl = await Voting.deploy()
    await deferPromise(8000);
    console.log(`votingImpl: ${votingImpl.address}`)
    proxy = await EternalStorageProxy.deploy(proxyStorage.address, votingImpl.address)
    await deferPromise(8000);

    console.log(`proxy: ${proxy.address}`)
    voting = await Voting.attach(proxy.address)
    await deferPromise(8000);

    console.log(`voting: ${voting.address}`)
    await voting.initialize()
    await deferPromise(8000);

    console.log(`voting.initialize`)

    // Initialize ProxyStorage
    await proxyStorage.initializeAddresses(blockReward.address, voting.address)
    await deferPromise(8000);

    console.log(`proxyStorage.initializeAddresses: ${blockReward.address}, ${voting.address}`)


    console.log(
      `
      Block Reward implementation ...................... ${blockRewardImpl.address}
      Block Reward storage ............................. ${blockReward.address}
      Consensus implementation ......................... ${consensusImpl.address}
      Consensus storage ................................ ${consensus.address}
      ProxyStorage implementation ...................... ${proxyStorageImpl.address}
      ProxyStorage storage ............................. ${proxyStorage.address}
      Voting implementation ............................ ${votingImpl.address}
      Voting storage ................................... ${voting.address}
      `
    )
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});