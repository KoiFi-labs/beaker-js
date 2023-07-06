import { NETWORK } from './Networks'

export type StablePoolConfig = {
    appId: number;
    appAddress: string;
    stablePoolAssetId: number;
    assetIdA: number;
    assetIdB: number;
    scale: number;
    fee: number;
}

export type StablePoolsConfig = {
//  eslint-disable-next-line
  [key in NETWORK]: StablePoolConfig
}

export const stablePoolsConfig: StablePoolsConfig = {
  sandbox: {
    appId: 210171059,
    appAddress: 'NC54JHX6ABAKAQMCTT5XIHDGLSZRU34IVWNJB2S6OPF76JGEPY2UZUDR7I',
    stablePoolAssetId: 210171142,
    assetIdA: 210124674,
    assetIdB: 210125266,
    scale: 1000000,
    fee: 5
  },
  testnet: {
    appId: 253926875,
    appAddress: 'GLPTQQ7QDN5KLJAIH2Y742EFGU7QKAT2OQD7JBWPHCSTSDGNRVFIDCGJXU',
    stablePoolAssetId: 253927235,
    assetIdA: 253927051,
    assetIdB: 253927090,
    scale: 1000000,
    fee: 5
  },
  mainnet: {
    appId: 210171059,
    appAddress: 'IID5QRQJM67CYN363FV26SQLG3MGJWEIR7VLT2CPSJ6Z7O6NHQV5I5GQVA',
    stablePoolAssetId: 210171142,
    assetIdA: 210124674,
    assetIdB: 210125266,
    scale: 1000,
    fee: 5
  }
}
