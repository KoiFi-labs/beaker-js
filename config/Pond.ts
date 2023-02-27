import { NETWORK } from './Networks'

export type PondConfig = {
    appId: number;
    appAddress: string;
    pondAssetId: number;
    assetIdA: number;
    assetIdB: number;
    scale: number;
    fee: number;
}

export type PondsConfig = {
//  eslint-disable-next-line
  [key in NETWORK]: PondConfig
}

export const pondsConfig: PondsConfig = {
  sandbox: {
    appId: 159723297,
    appAddress: 'IID5QRQJM67CYN363FV26SQLG3MGJWEIR7VLT2CPSJ6Z7O6NHQV5I5GQVA',
    pondAssetId: 159723450,
    assetIdA: 159703771,
    assetIdB: 159719100,
    scale: 1000,
    fee: 5
  },
  testnet: {
    appId: 159723297,
    appAddress: 'IID5QRQJM67CYN363FV26SQLG3MGJWEIR7VLT2CPSJ6Z7O6NHQV5I5GQVA',
    pondAssetId: 159723450,
    assetIdA: 159703771,
    assetIdB: 159719100,
    scale: 1000,
    fee: 5
  },
  mainnet: {
    appId: 159723297,
    appAddress: 'IID5QRQJM67CYN363FV26SQLG3MGJWEIR7VLT2CPSJ6Z7O6NHQV5I5GQVA',
    pondAssetId: 159723450,
    assetIdA: 159703771,
    assetIdB: 159719100,
    scale: 1000,
    fee: 5
  }
}
