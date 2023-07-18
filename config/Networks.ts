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
    token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    server: 'https://node.testnet.algoexplorerapi.io',
    indexer: 'https://testnet-idx.algonode.cloud',
    port: '',
    explorer: 'https://testnet.algoexplorer.io'
  },
  mainnet: {
    token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
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
