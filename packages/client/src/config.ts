import { SetupContractConfig } from '@latticexyz/std-client'
import { Wallet } from 'ethers'

const params = new URLSearchParams(window.location.search)

let privateKey = params.get('burnerWalletPrivateKey')
if (!privateKey) {
  privateKey = localStorage.getItem('burnerWallet') || Wallet.createRandom().privateKey
  localStorage.setItem('burnerWallet', privateKey)
}

export const initialGasPrice = Number(import.meta.env.VITE_INITIAL_GAS_PRICE)
export const faucetUrl = import.meta.env.VITE_FAUCET
export const config: SetupContractConfig = {
  clock: {
    period: 1000,
    initialTime: 0,
    syncInterval: 5000,
  },
  provider: {
    jsonRpcUrl: params.get('rpc') ?? import.meta.env.VITE_RPC,
    wsRpcUrl: params.get('wsRpc') ?? import.meta.env.VITE_WS,
    chainId: Number(params.get('chainId')) || Number(import.meta.env.VITE_CHAIN_ID),
  },
  privateKey,
  chainId: Number(params.get('chainId')) || Number(import.meta.env.VITE_CHAIN_ID),
  snapshotServiceUrl: params.get('snapshot') ?? import.meta.env.VITE_SNAPSHOT,
  initialBlockNumber: Number(params.get('initialBlockNumber')) || Number(import.meta.env.VITE_INITIAL_BLOCK_NUMBER),
  worldAddress: params.get('worldAddress') ?? import.meta.env.VITE_WORLD,
  devMode: (params.get('dev') ?? import.meta.env.VITE_DEV) === 'true',
  cacheAgeThreshold: 300,
  cacheInterval: 100,
}
