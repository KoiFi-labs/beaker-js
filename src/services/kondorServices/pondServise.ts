import { contract } from './contract'
import algosdk from 'algosdk'
import { config } from '../../../config'
import { mySigner } from '../signer'

const client = new algosdk.Algodv2(config.network.token, config.network.server, config.network.port)

export const swap = async (addr: string, amount: number, assetOutput: number) => {
  const sp = await client.getTransactionParams().do()
  const abiContract = new algosdk.ABIContract(contract)

  const signer = await mySigner(addr)

  const commonParams = {
    appID: config.pond.appId,
    sender: addr,
    suggestedParams: sp,
    signer
  }

  const comp = new algosdk.AtomicTransactionComposer()

  const assetTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: addr,
    to: config.pond.appAddress,
    amount: amount * 1000 * 1000,
    assetIndex: assetOutput,
    suggestedParams: { ...sp, fee: 3000, flatFee: true }
  })

  comp.addMethodCall({
    method: abiContract.getMethodByName('swap'),
    methodArgs: [
      {
        txn: assetTransferTxn,
        signer
      },
      config.pond.assetIdA,
      config.pond.assetIdB
    ],
    ...commonParams
  })

  const results = await comp.execute(client, 2)
  return {
    result: results.methodResults[0].returnValue,
    txId: results.methodResults[0].txID
  }
}

export const mint = async (addr: string, amount: number, assetA: number, assetB: number) => {
  const sp = await client.getTransactionParams().do()
  const abiContract = new algosdk.ABIContract(contract)
  const signer = await mySigner(addr)

  const commonParams = {
    appID: config.pond.appId,
    sender: addr,
    suggestedParams: sp,
    signer
  }

  const comp = new algosdk.AtomicTransactionComposer()

  const assetTransferTxnA = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: addr,
    to: config.pond.appAddress,
    amount: amount * 1000,
    assetIndex: config.pond.assetIdA,
    suggestedParams: { ...sp, fee: 3000 }
  })

  const assetTransferTxnB = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: addr,
    to: config.pond.appAddress,
    amount: amount * 1000,
    assetIndex: config.pond.assetIdB,
    suggestedParams: { ...sp, fee: 3000 }
  })

  comp.addMethodCall({
    method: abiContract.getMethodByName('mint'),
    methodArgs: [
      {
        txn: assetTransferTxnA,
        signer
      },
      {
        txn: assetTransferTxnB,
        signer
      },
      config.pond.pondAssetId,
      config.pond.assetIdA,
      config.pond.assetIdB
    ],
    ...commonParams
  })
  const results = await comp.execute(client, 2)
  return {
    result: results.methodResults[0].returnValue,
    txId: results.methodResults[0].txID
  }
}

export const optin = async (addr: string, amount: number, assetA: number, assetB: number) => {
  const sp = await client.getTransactionParams().do()
  const signer = await mySigner(addr)

  const commonParams = {
    appID: config.pond.appId,
    sender: addr,
    suggestedParams: sp,
    signer
  }

  const comp = new algosdk.AtomicTransactionComposer()

  const optinTransfer = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: addr,
    to: addr,
    amount: 0,
    assetIndex: config.pond.pondAssetId,
    suggestedParams: sp
  })

  comp.addTransaction({
    txn: optinTransfer,
    ...commonParams
  })

  const results = await comp.execute(client, 2)
  return {
    result: results.methodResults[0].returnValue,
    txId: results.methodResults[0].txID
  }
}

export const bootstrap = async (addr: string, amount: number, assetA: number, assetB: number) => {
  try {
    const sp = await client.getTransactionParams().do()
    const abiContract = new algosdk.ABIContract(contract)
    const signer = await mySigner(addr)

    const commonParams = {
      appID: config.pond.appId,
      sender: addr,
      suggestedParams: sp,
      signer
    }

    const comp = new algosdk.AtomicTransactionComposer()

    const seed = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: addr,
      to: config.pond.appAddress,
      amount: 1000000,
      suggestedParams: { ...sp, fee: 5000 }
    })

    comp.addMethodCall({
      method: abiContract.getMethodByName('bootstrap'),
      methodArgs: [
        {
          txn: seed,
          signer
        },
        config.pond.assetIdA,
        config.pond.assetIdB
      ],
      ...commonParams
    })
    const results = await comp.execute(client, 2)

    console.log('results', results)
    return {
      result: results.methodResults[0].returnValue,
      txId: results.methodResults[0].txID
    }
  } catch (e) {
    console.log('error', e)
  }
}

export const getSwapResult = async (amountAssetOut: number, assetOut: number, assetIn: number) => {
  const [assetOutSupply, assetInSupply] = await Promise.all([
    getAssetSupply(assetOut),
    getAssetSupply(assetIn)
  ])
  const factor = config.pond.scale - config.pond.fee
  return (amountAssetOut * factor * assetInSupply) / ((assetOutSupply * config.pond.scale) + (amountAssetOut * factor))
}

const getAssetSupply = async (assetId: number) => {
  const accountInfo = await client.accountInformation(config.pond.appAddress).do()
  const assetInfo = accountInfo.assets.find((asset: any) => asset['asset-id'] === assetId)
  return assetInfo.amount
}
