import algoSdk from 'algosdk'
import { config } from '../../config'

const algoClient = new algoSdk.Algodv2(config.network.token, config.network.server, config.network.port)

export type Balance = {
    assetId: number;
    amount: number;
    name?: string;
    symbol?: string;
    icon?: string;
}

const getBalances: (account: string) => Promise<Balance[]> = async (account) => {
  const accountInfo = await algoClient.accountInformation(account).do()
  const algorandTokenInfo = config.assetList.find((assetItem) => assetItem.id === 0)

  return accountInfo.assets.map((asset: any) => {
    const assetInfo = config.assetList.find((assetItem) => assetItem.id === asset['asset-id'])
    if (assetInfo) {
      return {
        assetId: asset['asset-id'],
        amount: asset.amount,
        name: assetInfo.name,
        symbol: assetInfo.symbol,
        icon: assetInfo.icon
      }
    }
    return {
      assetId: asset['asset-id'],
      amount: asset.amount,
      name: null,
      symbol: null,
      icon: null
    }
  }).concat({
    assetId: algorandTokenInfo?.id,
    amount: accountInfo.amount,
    name: algorandTokenInfo?.name,
    symbol: algorandTokenInfo?.symbol,
    icon: algorandTokenInfo?.icon
  })
}

const healthCheck = async () => {
  await algoClient.status().do()
}

const generateAccount = () => {
  return algoSdk.generateAccount()
}

const secretKeyToMnemonic = (secretKey: Uint8Array) => {
  return algoSdk.secretKeyToMnemonic(secretKey)
}

export const algoService = {
  getBalances,
  healthCheck,
  generateAccount,
  secretKeyToMnemonic
}
