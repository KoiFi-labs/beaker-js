import { networks } from './Networks'
import { assetsConfig } from './Assets'
import { stablePoolsConfig } from './StablePool'
import { poolsConfig } from './Pools'
export type { Asset } from './Assets'

export const config = {
  network: networks.testnet,
  assetList: assetsConfig.testnet,
  stablePool: stablePoolsConfig.testnet,
  pools: poolsConfig.testnet,
  scale: 1000,
  decimalScale: 1000000,
  fee: 3
}
