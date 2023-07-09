import { NETWORK } from './Networks'
import { Pool } from '../interfaces'
import { amm } from './amm'

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
      appId: amm.gobtc.appId,
      appAddress: amm.gobtc.appAddress,
      lpId: amm.gobtc.lp,
      assetIdA: amm.gobtc.assetA,
      assetIdB: amm.gobtc.assetB,
      scale: 1000000,
      fee: 5
    },
    {
      name: 'goETH/KONDOR-LP',
      appId: amm.goeth.appId,
      appAddress: amm.goeth.appAddress,
      lpId: amm.goeth.lp,
      assetIdA: amm.goeth.assetA,
      assetIdB: amm.goeth.assetB,
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
