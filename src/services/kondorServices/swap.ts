import { swapper } from './contracts/swapper'
import algosdk from 'algosdk'
import { config } from '../../../config'
import { mySigner } from '../signer'
import { stableForStableSwap } from './symmetricPoolServise'

const SCALE_DECIMALS = 1000000
const SCALE_FEE = 1000
const nT = 2 // number of assets in the pool
const maxLoopLimit = 250
const __A = 10
const A_PRECISION: number = 100
const A: number = __A * A_PRECISION

const client = new algosdk.Algodv2(config.network.token, config.network.server, config.network.port)

export const swap = async (addr: string, amountOut: number, assetIn: number, assetOut: number) => {
  if (assetIn === assetOut) throw new Error('assetIn can not be equal to assetOut')
  if (isStableAsset(assetIn) && isStableAsset(assetOut)) return await stableForStableSwap(addr, amountOut, assetOut)
  if (isStableAsset(assetOut) && !isStableAsset(assetIn)) return await stableForNoStableSwap(addr, amountOut, assetOut, assetIn)
  if (isStableAsset(assetIn) && !isStableAsset(assetOut)) return await noStableForStableSwap(addr, amountOut, assetOut, assetIn)
  if (!isStableAsset(assetIn) && !isStableAsset(assetOut)) return await noStableForNoStableSwap(addr, amountOut, assetOut, assetIn)
}

export const stableForNoStableSwap = async (addr: string, amount: number, assetOut: number, assetIn: number) => {
  try {
    if (!isStableAsset(assetOut)) throw new Error('assetOut should be stable')
    if (isStableAsset(assetIn)) throw new Error('assetIn should not be stable')
    const noStablePool = getPoolByAsset(assetIn)
    const sp = await client.getTransactionParams().do()
    const abiContract = new algosdk.ABIContract(swapper)
    const signer = await mySigner(addr)
    const comp = new algosdk.AtomicTransactionComposer()

    const axfer = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: addr,
      to: config.stablePool.appAddress,
      amount: amount * SCALE_DECIMALS,
      assetIndex: assetOut,
      suggestedParams: sp
    })

    const pxfer = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: addr,
      to: config.swapper.appAddress,
      amount: 7000,
      suggestedParams: sp
    })

    comp.addMethodCall({
      suggestedParams: { ...sp, flatFee: true, fee: 9 * 1000 },
      appID: config.swapper.appId,
      method: abiContract.getMethodByName('swap_s_ns'),
      methodArgs: [
        {
          txn: pxfer,
          signer
        },
        {
          txn: axfer,
          signer
        },
        config.stablePool.assetIdA,
        config.stablePool.assetIdB,
        config.stablePool.appId,
        config.stablePool.appAddress,
        config.stablePool.stablePoolAssetId,
        assetIn,
        noStablePool.appId,
        noStablePool.appAddress
      ],
      sender: addr,
      signer,
      appForeignApps: [config.stablePool.appId, noStablePool.appId],
      appForeignAssets: [config.stablePool.assetIdB, config.stablePool.assetIdA, config.stablePool.stablePoolAssetId]
    })

    const results = await comp.execute(client, 2)
    return {
      result: results.methodResults[0].returnValue,
      txId: results.methodResults[0].txID
    }
  } catch (error) {
    console.log(error)
  }
}

export const noStableForStableSwap = async (addr: string, amount: number, assetOut: number, assetIn: number) => {
  try {
    if (isStableAsset(assetOut)) throw new Error('assetOut should not be stable')
    if (!isStableAsset(assetIn)) throw new Error('assetIn should be stable')
    const noStablePool = getPoolByAsset(assetOut)
    const sp = await client.getTransactionParams().do()
    const abiContract = new algosdk.ABIContract(swapper)
    const signer = await mySigner(addr)
    const comp = new algosdk.AtomicTransactionComposer()

    const axfer = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: addr,
      to: noStablePool.appAddress,
      amount: amount * SCALE_DECIMALS,
      assetIndex: assetOut,
      suggestedParams: sp
    })

    const pxfer = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: addr,
      to: noStablePool.appAddress,
      amount: 7000,
      suggestedParams: sp
    })

    comp.addMethodCall({
      suggestedParams: { ...sp, flatFee: true, fee: 11 * 1000 },
      appID: config.swapper.appId,
      method: abiContract.getMethodByName('swap_ns_s'),
      methodArgs: [
        {
          txn: pxfer,
          signer
        },
        {
          txn: axfer,
          signer
        },
        noStablePool.appId,
        noStablePool.appAddress,
        assetIn,
        config.stablePool.assetIdA,
        config.stablePool.assetIdB,
        config.stablePool.stablePoolAssetId,
        config.stablePool.appId,
        config.stablePool.appAddress
      ],
      sender: addr,
      signer,
      appForeignApps: [config.stablePool.appId, noStablePool.appId],
      appForeignAssets: [config.stablePool.assetIdB, config.stablePool.assetIdA, config.stablePool.stablePoolAssetId, assetOut]
    })

    const results = await comp.execute(client, 2)
    return {
      result: results.methodResults[0].returnValue,
      txId: results.methodResults[0].txID
    }
  } catch (error) {
    console.log(error)
  }
}

export const noStableForNoStableSwap = async (addr: string, amount: number, assetOut: number, assetIn: number) => {
  try {
    if (isStableAsset(assetOut)) throw new Error('assetOut should not be stable')
    if (isStableAsset(assetIn)) throw new Error('assetIn should not be stable')
    const inPool = getPoolByAsset(assetIn)
    const outPool = getPoolByAsset(assetOut)
    const sp = await client.getTransactionParams().do()
    const abiContract = new algosdk.ABIContract(swapper)
    const signer = await mySigner(addr)
    const comp = new algosdk.AtomicTransactionComposer()

    const axfer = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: addr,
      to: outPool.appAddress,
      amount: amount * SCALE_DECIMALS,
      assetIndex: assetOut,
      suggestedParams: sp
    })

    const pxfer = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: addr,
      to: outPool.appAddress,
      amount: 7000,
      suggestedParams: sp
    })

    comp.addMethodCall({
      suggestedParams: { ...sp, flatFee: true, fee: 9 * 1000 },
      appID: config.swapper.appId,
      method: abiContract.getMethodByName('swap_ns_ns'),
      methodArgs: [
        {
          txn: pxfer,
          signer
        },
        {
          txn: axfer,
          signer
        },
        outPool.appId,
        outPool.appAddress,
        config.stablePool.stablePoolAssetId,
        assetIn,
        inPool.appId,
        inPool.appAddress
      ],
      sender: addr,
      signer,
      appForeignApps: [inPool.appId, outPool.appId],
      appForeignAssets: [assetIn, assetOut, config.stablePool.stablePoolAssetId]
    })

    const results = await comp.execute(client, 2)
    return {
      result: results.methodResults[0].returnValue,
      txId: results.methodResults[0].txID
    }
  } catch (error) {
    console.log(error)
  }
}

export const isStableAsset = (assetId: number) => {
  return assetId === config.stablePool.assetIdA || assetId === config.stablePool.assetIdB
}

export const getPoolByAsset = (assetId: number) => {
  return config.pools.filter(p => p.assetIdB === assetId)[0]
}

export const getMintAmount = async (amount: number, assetToKnow: number) => {
  if (assetToKnow !== config.stablePool.assetIdA && assetToKnow !== config.stablePool.assetIdB) {
    throw new Error('Invalid asset')
  }
  const [assetASupply, assetBSupply] = await Promise.all([
    getAssetBalance(config.stablePool.assetIdA, config.stablePool.appAddress),
    getAssetBalance(config.stablePool.assetIdB, config.stablePool.appAddress)
  ])
  if (assetToKnow === config.stablePool.assetIdA) {
    return amount / (assetASupply / assetBSupply)
  }
  return amount / (assetBSupply / assetASupply)
}

const getAssetBalance = async (assetId: number, address: string) => {
  const accountInfo = await client.accountInformation(address).do()
  const assetInfo = accountInfo.assets.find((asset: any) => asset['asset-id'] === assetId)
  return assetInfo.amount || 0
}

export const calculateOutSwap = async (outAmount: number, assetIn: number) => {
  const assetOut = assetIn === config.stablePool.assetIdA ? config.stablePool.assetIdA : config.stablePool.assetIdB
  const [outSupply, inSupply] = await Promise.all([
    getAssetBalance(assetOut, config.stablePool.appAddress),
    getAssetBalance(assetIn, config.stablePool.appAddress)
  ])
  const factor = config.stablePool.scale - config.stablePool.fee
  return (outAmount * inSupply * config.stablePool.scale) / ((outSupply - outAmount) * factor)
}

export const calculateInSwap = async (
  amount: number,
  assetOut: number
): Promise<number> => {
  const amountToSwap = Math.round(amount * config.decimalScale)
  const [aSupply, bSupply] = await getPoolSupply()
  const outSupply = assetOut === config.stablePool.assetIdA ? aSupply : bSupply
  const inSupply = assetOut === config.stablePool.assetIdA ? bSupply : aSupply
  const fee = config.stablePool.fee
  const x: number = amountToSwap + inSupply
  const y = getY(x, inSupply, outSupply)
  let dy: number = outSupply - y
  const dyFee: number = dy * (Math.round(fee / SCALE_FEE))
  dy = Math.max(dy - dyFee, 0)
  return dy
}

function difference (a: number, b: number): number {
  return a > b ? a - b : b - a
}

function within1 (a: number, b: number): boolean {
  return difference(a, b) <= (1 * SCALE_DECIMALS)
}

function getD (poolABalance: number, poolBBalance: number): number {
  const s = poolABalance + poolBBalance
  if (s === 0) return 0
  let d = s
  const nA = A * nT
  let prevD = 0
  for (let i = 0; i < maxLoopLimit; i++) {
    let dp = d
    dp = Math.round((dp * d) / (poolABalance * nT))
    dp = Math.round((dp * d) / (poolBBalance * nT))
    prevD = d
    d =
      Math.round(((Math.round((nA * s) / A_PRECISION) + (dp * nT)) * d) /
        (Math.round(((nA - A_PRECISION) * d) / A_PRECISION) + ((nT + 1) * dp)))
    if (within1(d, prevD)) {
      return d
    }
  }
  throw new Error('D does not converge')
}

function getY (x: number, assetInBalance: number, assetOutBalance: number): number {
  const d = getD(assetInBalance, assetOutBalance)

  const nT = 2
  const nA = nT * A

  let c = Math.round((d ** 2) / (x * nT))
  c = Math.round(((c * d) * A_PRECISION) / (nA * nT))
  const b = x + Math.round((d * A_PRECISION) / nA)

  let y = d

  for (let i = 0; i < maxLoopLimit; i++) {
    const yPrev = y
    y = Math.round(((y * y) + c) / (((y * 2) + b) - d))
    if (within1(y, yPrev)) {
      return y
    }
  }
  throw new Error('Approximation did not converge')
}

export const getPoolSupply = async (): Promise<[number, number]> => {
  const aSupply = await getAssetBalance(config.stablePool.assetIdA, config.stablePool.appAddress)
  const bSupply = await getAssetBalance(config.stablePool.assetIdB, config.stablePool.appAddress)
  return [aSupply, bSupply]
}
