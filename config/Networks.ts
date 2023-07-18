/* eslint-disable no-unused-vars */
export const networks = {
  sandbox: {
    token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    server: 'http://127.0.0.1',
    indexer: 'https://testnet-idx.algonode.cloud',
    port: '4001',
    explorer: ''
  },
  testnet: {
    token: process.env.NEXT_PUBLIC_ALGO_TOKEN,
    server: process.env.NEXT_PUBLIC_ALGO_SERVER,
    indexer: process.env.NEXT_PUBLIC_ALGO_INDEXER,
    port: '',
    explorer: process.env.NEXT_PUBLIC_ALGO_EXPLORER
  },
  mainnet: {
    token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    server: 'https://mainnet-api.algonode.cloud',
    indexer: 'https://mainnet-idx.algonode.cloud',
    port: '',
    explorer: 'https://algoexplorer.io'
  }
}

export enum NETWORK {
    sandbox = 'sandbox',
    testnet = 'testnet',
    mainnet = 'mainnet',
}
