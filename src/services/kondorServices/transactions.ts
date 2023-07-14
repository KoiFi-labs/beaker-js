import algosdk, { isValidAddress } from 'algosdk'
import { config } from '../../../config'
import { mySigner } from '../signer'
import { getAssetById } from './symmetricPoolServise'
import { algorandErrorCleaner, stringToUint8Array } from '../../utils/utils'
import { AssetInfo, TransactionParams } from './types'

const client = new algosdk.Algodv2(config.network.token, config.network.server, config.network.port)
const indexer = new algosdk.Indexer(config.network.token, config.network.indexer, config.network.port)

export const createTransaction = async (addr: string, amount: number, assetId: number, receiver: string, tags: string[]) => {
  try {
    if (!isValidAddress(receiver)) throw new Error('Invalid receiver')
    if (amount <= 0) throw new Error('Invalid amount')
    const asset = getAssetById(assetId)
    if (!asset) throw new Error('Invalid asset')
    const sp = await client.getTransactionParams().do()
    const signer = await mySigner(addr)
    const comp = new algosdk.AtomicTransactionComposer()

    const axfer = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: addr,
      to: receiver,
      amount: amount * (Math.pow(10, asset.decimals)),
      assetIndex: assetId,
      suggestedParams: sp,
      note: tags.length ? encondeTags(tags) : undefined
    })

    comp.addTransaction({
      txn: axfer,
      signer
    })

    const results = await comp.execute(client, 2)
    return {
      result: results,
      txId: results.txIDs[0],
      error: false,
      errorDetails: ''
    }
  } catch (error: any) {
    console.log(JSON.stringify(error))
    return {
      error: true,
      errorDetails: algorandErrorCleaner(
        error?.message ||
        error
      )
    }
  }
}

const encondeTags = (tags: string[]) => {
  return stringToUint8Array('tags:'.concat(tags.join('&-').concat('.')))
}

export const createTransactionsBatch = async (addr: string, transactions: TransactionParams[]) => {
  try {
    const sp = await client.getTransactionParams().do()
    const signer = await mySigner(addr)
    const comp = new algosdk.AtomicTransactionComposer()
    if (transactions.length > 12) throw new Error('Transactions amonut is 12 maximun')

    const uniqueAssets = await getUniqueAssets(transactions.filter(tx => tx.assetId !== 0).map(tx => tx.assetId))

    const getAssetDecimals = (assetId: number) => {
      if (assetId === 0) return 6
      const decimals = uniqueAssets.find(a => a.asset.index === assetId)?.asset.params.decimals
      if (decimals === undefined) throw new Error('Asset not found')
      return decimals
    }

    const txs = transactions.map(tx => {
      if (tx.assetId === 0) {
        return algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: addr,
          to: tx.to,
          amount: tx.amount * Math.pow(10, 6),
          suggestedParams: sp,
          note: tx.tags.length ? encondeTags(tx.tags) : undefined
        })
      }
      return algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: addr,
        to: tx.to,
        amount: tx.amount * (Math.pow(10, getAssetDecimals(tx.assetId))),
        assetIndex: tx.assetId,
        suggestedParams: sp,
        note: tx.tags.length ? encondeTags(tx.tags) : undefined
      })
    })

    txs.forEach(tx => {
      comp.addTransaction({
        txn: tx,
        signer
      })
    })

    const results = await comp.execute(client, 2)
    console.log(results)
    return {
      result: results,
      txId: results.txIDs[0],
      error: false,
      errorDetails: ''
    }
  } catch (error: any) {
    console.log(JSON.stringify(error))
    return {
      error: true,
      errorDetails: algorandErrorCleaner(
        error?.message ||
        error
      )
    }
  }
}

export const getUniqueAssets = async (assetIds: number[]) => {
  const uniqueAssets = []
  const assetInfoMap = new Map()

  for (const assetId of assetIds) {
    if (!assetInfoMap.has(assetId)) {
      try {
        const assetInfo = await indexer.lookupAssetByID(assetId).do()
        assetInfoMap.set(assetId, assetInfo)
        uniqueAssets.push(assetInfo)
      } catch (error) {
        console.error(`Error getting asset details for assetId ${assetId}:`, error)
      }
    }
  }
  return uniqueAssets as AssetInfo[]
}

export const getSuggestedParams = async () => {
  return await client.getTransactionParams().do()
}
