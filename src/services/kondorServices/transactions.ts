import algosdk, { isValidAddress } from 'algosdk'
import { config } from '../../../config'
import { mySigner } from '../signer'
import { getAssetById } from './symmetricPoolServise'
import { algorandErrorCleaner, stringToUint8Array } from '../../utils/utils'

const client = new algosdk.Algodv2(config.network.token, config.network.server, config.network.port)

export const createTransaction = async (addr: string, amount: number, assetId: number, receiver: string, tags: string[]) => {
  try {
    console.log('create tx', tags)
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
