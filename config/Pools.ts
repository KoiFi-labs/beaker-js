import { NETWORK } from './Networks'
import { Pool } from '../interfaces'

export type PoolsConfig = {
//  eslint-disable-next-line
  [key in NETWORK]: Pool[]
}

export const poolsConfig: PoolsConfig = {
  sandbox: [
    {
      name: 'WBTC/KONDOR-LP',
      appId: 210171059,
      appAddress: 'NC54JHX6ABAKAQMCTT5XIHDGLSZRU34IVWNJB2S6OPF76JGEPY2UZUDR7I',
      lpId: 210171142,
      assetIdA: 210124674,
      assetIdB: 210125266,
      scale: 1000000,
      fee: 5
    }
  ],
  testnet: [
    {
      name: 'WBTC/KONDOR-LP',
      appId: 249657042,
      appAddress: 'JQ4BHLEI3YTOIPPR7PI3WRKWDWY7R3WHHYCBPQ7JK7AFUSRX27WAT3KISI',
      lpId: 250299512,
      assetIdA: 249671352,
      assetIdB: 210171142,
      scale: 1000000,
      fee: 5
    }
  ],
  mainnet: [
    {
      name: 'WBTC/KONDOR-LP',
      appId: 210171059,
      appAddress: 'IID5QRQJM67CYN363FV26SQLG3MGJWEIR7VLT2CPSJ6Z7O6NHQV5I5GQVA',
      lpId: 210171142,
      assetIdA: 210124674,
      assetIdB: 210125266,
      scale: 1000,
      fee: 5
    }
  ]
}
