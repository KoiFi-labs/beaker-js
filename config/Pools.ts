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
      name: 'goBTC/KONDOR-LP',
      appId: 253926956,
      appAddress: 'UU7N6H5R34T4WSLECHBYRJMI3KN36BT6GG6HCTDPVH3HEBEGROUWCTDCQI',
      lpId: 253927506,
      assetIdA: 253927235,
      assetIdB: 253927168,
      scale: 1000000,
      fee: 5
    },
    {
      name: 'goETH/KONDOR-LP',
      appId: 253926987,
      appAddress: 'IBZRA3LAHZTZFZ3BD7ARKEOPRHCILUTALKGZIAN3LPEHRRP646FKQUF43I',
      lpId: 253927506,
      assetIdA: 253927235,
      assetIdB: 253927203,
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
