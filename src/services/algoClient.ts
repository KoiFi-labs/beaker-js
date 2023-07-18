import algoSdk from 'algosdk'
import { config } from '../../config'
import { Transaction } from '../../interfaces'
import { base64Decode } from '../utils/utils'
import { AssetInfo } from './kondorServices/types'
import { getAccountInformation, getAsset, getTransactionsByAccount } from './algoService'

export type Balance = {
    assetId: number;
    amount: number;
    name?: string;
    symbol?: string;
    icon?: string;
}

// ok
export const getBalances: (account: string) => Promise<Balance[]> = async (account) => {
  const accountInfo = await getAccountInformation(account)
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

export const generateAccount = () => {
  return algoSdk.generateAccount()
}

export const secretKeyToMnemonic = (secretKey: Uint8Array) => {
  return algoSdk.secretKeyToMnemonic(secretKey)
}

export const hasOptin: (account: string, asset: number) => Promise<boolean> =
  async (account: string, asset: number) => {
    const accountInfo = await getAccountInformation(account)
    return accountInfo.assets.some((assetItem: any) => assetItem['asset-id'] === asset)
  }

export const getTransactions = async (account: string) => {
  const txs = await getTransactionsByAccount(account, 10)
  const parsedTxs = parseTransactions(txs)
  return parsedTxs
}

const parseTransactions: (txs: any) => Transaction[] = (txs: any) => {
  return txs?.transactions.map((tx: any) => {
    return {
      txId: tx?.id || '',
      sender: tx?.sender || '',
      receiver: tx['asset-transfer-transaction'] ? tx['asset-transfer-transaction'].receiver : '',
      amount: tx['asset-transfer-transaction']?.amount || 0,
      asset: tx['asset-transfer-transaction'] ? tx['asset-transfer-transaction']['asset-id'] : 0,
      note: tx?.note ? base64Decode(tx.note) : '',
      txType: tx['tx-type']
    }
  })
}

export const getAssetDetails = async (assetId: number) => {
  try {
    const assetInfo = await getAsset(assetId)
    return assetInfo as AssetInfo
  } catch (error) {
    return null
  }
}

export const getAddressMinBalance = async (account: string) => {
  const accountInfo = await getAccountInformation(account)
  return accountInfo['min-balance']
}
