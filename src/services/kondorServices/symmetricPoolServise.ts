import { stablePool } from './contracts/stablePool'
import algosdk from 'algosdk'
import { config } from '../../../config'
import { mySigner } from '../signer'

const TOTAL_SUPPLY = 1e14 // This value must be obtained from the smarth stablePool
const SCALE_DECIMALS = 1000000
const SCALE_FEE = 1000
const nT = 2 // number of assets in the pool
const maxLoopLimit = 250
const __A = 10
const A_PRECISION: number = 100
const A: number = __A * A_PRECISION

const client = new algosdk.Algodv2(config.network.token, config.network.server, config.network.port)

export const stableForStableSwap = async (addr: string, amount: number, assetOutput: number) => {
  const sp = await client.getTransactionParams().do()
  const abiContract = new algosdk.ABIContract(stablePool)
  const signer = await mySigner(addr)
  const comp = new algosdk.AtomicTransactionComposer()

  const assetTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: addr,
    to: config.stablePool.appAddress,
    amount: amount * SCALE_DECIMALS,
    assetIndex: assetOutput,
    suggestedParams: { ...sp, flatFee: true, fee: 1000 }
  })

  comp.addMethodCall({
    method: abiContract.getMethodByName('swap'),
    methodArgs: [
      {
        txn: assetTransferTxn,
        signer
      },
      config.stablePool.assetIdA,
      config.stablePool.assetIdB
    ],
    appID: config.stablePool.appId,
    sender: addr,
    suggestedParams: { ...sp, flatFee: true, fee: 4 * 1000 },
    signer
  })

  const results = await comp.execute(client, 2)
  console.log(results)
  return {
    result: results.methodResults[0].returnValue,
    txId: results.methodResults[0].txID
  }
}

export const mint = async (addr: string, aAmount: number, bAmount: number) => {
  const sp = await client.getTransactionParams().do()
  const abiContract = new algosdk.ABIContract(stablePool)
  const signer = await mySigner(addr)
  const comp = new algosdk.AtomicTransactionComposer()

  if (aAmount <= 0 && bAmount <= 0) throw new Error('aAmount or bAmount should be a positive number')

  const assetTransferTxnA = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: addr,
    to: config.stablePool.appAddress,
    amount: aAmount * SCALE_DECIMALS,
    assetIndex: config.stablePool.assetIdA,
    suggestedParams: sp
  })

  const assetTransferTxnB = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: addr,
    to: config.stablePool.appAddress,
    amount: bAmount * SCALE_DECIMALS,
    assetIndex: config.stablePool.assetIdB,
    suggestedParams: sp
  })

  if (aAmount > 0 && bAmount > 0) {
    comp.addMethodCall({
      method: abiContract.getMethodByName('mint_custom'),
      methodArgs: [
        {
          txn: assetTransferTxnA,
          signer
        },
        {
          txn: assetTransferTxnB,
          signer
        },
        config.stablePool.stablePoolAssetId,
        config.stablePool.assetIdA,
        config.stablePool.assetIdB
      ],
      appID: config.stablePool.appId,
      sender: addr,
      suggestedParams: { ...sp, flatFee: true, fee: 4 * 1000 },
      signer
    })
  } else {
    const txn = aAmount > 0 ? assetTransferTxnA : assetTransferTxnB
    comp.addMethodCall({
      method: abiContract.getMethodByName('mint_single'),
      methodArgs: [
        {
          txn,
          signer
        }
      ],
      appID: config.stablePool.appId,
      sender: addr,
      suggestedParams: { ...sp, flatFee: true, fee: 4 * 1000 },
      signer,
      appForeignAssets: [config.stablePool.assetIdB, config.stablePool.assetIdA, config.stablePool.stablePoolAssetId]
    })
  }

  const results = await comp.execute(client, 2)
  console.log(results)
  return {
    result: results.methodResults[0].returnValue,
    txId: results.methodResults[0].txID
  }
}

export const burn = async (addr: string, amount: number) => {
  const sp = await client.getTransactionParams().do()
  const abiContract = new algosdk.ABIContract(stablePool)
  const signer = await mySigner(addr)
  const comp = new algosdk.AtomicTransactionComposer()

  const assetTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: addr,
    to: config.stablePool.appAddress,
    amount: amount * SCALE_DECIMALS,
    assetIndex: config.stablePool.stablePoolAssetId,
    suggestedParams: sp
  })

  comp.addMethodCall({
    method: abiContract.getMethodByName('burn'),
    methodArgs: [
      {
        txn: assetTransferTxn,
        signer
      },
      config.stablePool.stablePoolAssetId,
      config.stablePool.assetIdA,
      config.stablePool.assetIdB
    ],
    appID: config.stablePool.appId,
    sender: addr,
    suggestedParams: { ...sp, flatFee: true, fee: 3 * 1000 },
    signer
  })

  const results = await comp.execute(client, 2)
  console.log(results)
  return {
    result: results.methodResults[0].returnValue,
    txId: results.methodResults[0].txID
  }
}

export const optin = async (addr: string, asset: number) => {
  const sp = await client.getTransactionParams().do()
  const signer = await mySigner(addr)

  const commonParams = {
    appID: config.stablePool.appId,
    sender: addr,
    suggestedParams: sp,
    signer
  }

  const comp = new algosdk.AtomicTransactionComposer()

  const optinTransfer = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: addr,
    to: addr,
    amount: 0,
    assetIndex: asset,
    suggestedParams: sp
  })

  comp.addTransaction({
    txn: optinTransfer,
    ...commonParams
  })

  const results = await comp.execute(client, 2)

  return {
    txId: results.txIDs[0]
  }
}

export const createAsset = async (addr: string) => {
  const sp = await client.getTransactionParams().do()
  const signer = await mySigner(addr)

  const commonParams = {
    appID: config.stablePool.appId,
    sender: addr,
    suggestedParams: sp,
    signer
  }

  const comp = new algosdk.AtomicTransactionComposer()

  const assetName = 'USDC'
  const assetTotal = 18446744073709551615n
  const assetDecimals = 6
  const assetAddress = addr
  const assetMetadata = {
    total: assetTotal,
    decimals: assetDecimals,
    defaultFrozen: false,
    unitName: 'USDT',
    assetName,
    managerAddr: assetAddress,
    reserveAddr: assetAddress,
    freezeAddr: assetAddress,
    clawbackAddr: assetAddress
  }

  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: assetAddress,
    ...assetMetadata,
    suggestedParams: sp
  })

  comp.addTransaction({
    txn,
    ...commonParams
  })

  const results = await comp.execute(client, 2)

  console.log('results', results)
  return {
    result: results.methodResults[0].returnValue,
    txId: results.methodResults[0].txID
  }
}

export const bootstrap = async (addr: string, amount: number, assetA: number, assetB: number) => {
  try {
    const sp = await client.getTransactionParams().do()
    const abiContract = new algosdk.ABIContract(stablePool)
    const signer = await mySigner(addr)

    const commonParams = {
      appID: config.stablePool.appId,
      sender: addr,
      suggestedParams: sp,
      signer
    }

    const comp = new algosdk.AtomicTransactionComposer()

    const seed = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: addr,
      to: config.stablePool.appAddress,
      amount: 1000000,
      suggestedParams: { ...sp, fee: 7000 }
    })

    comp.addMethodCall({
      method: abiContract.getMethodByName('bootstrap'),
      methodArgs: [
        {
          txn: seed,
          signer
        },
        config.stablePool.assetIdA,
        config.stablePool.assetIdB
      ],
      ...commonParams
    })
    const results = await comp.execute(client, 2)

    return {
      result: results.methodResults[0].returnValue,
      txId: results.methodResults[0].txID
    }
  } catch (e) {
    console.log('error', e)
  }
}

export const getMintAmount = async (amount: number, assetToKnow: number) => {
  if (assetToKnow !== config.stablePool.assetIdA && assetToKnow !== config.stablePool.assetIdB) {
    throw new Error('Invalid asset')
  }
  const [assetASupply, assetBSupply] = await getStablePoolSupply()
  if (assetToKnow === config.stablePool.assetIdA) {
    return amount / (assetASupply / assetBSupply)
  }
  return amount / (assetBSupply / assetASupply)
}

const getAssetBalance = async (assetId: number, address: string) => {
  const accountInfo = await client.accountInformation(address).do()
  const assetInfo = accountInfo.assets.find((asset: any) => asset['asset-id'] === assetId)
  return assetInfo?.amount || 0
}

export const calculateOutStableSwap = async (outAmount: number, assetIn: number) => {
  const assetOut = assetIn === config.stablePool.assetIdA ? config.stablePool.assetIdA : config.stablePool.assetIdB
  const [outSupply, inSupply] = await Promise.all([
    getAssetBalance(assetOut, config.stablePool.appAddress),
    getAssetBalance(assetIn, config.stablePool.appAddress)
  ])
  const factor = config.stablePool.scale - config.stablePool.fee
  return (outAmount * inSupply * config.stablePool.scale) / ((outSupply - outAmount) * factor)
}

export const calculateInStableSwap = async (
  amount: number,
  assetOut: number
): Promise<number> => {
  const amountToSwap = Math.round(amount * config.decimalScale)
  const [aSupply, bSupply] = await getStablePoolSupply()
  const outSupply = assetOut === config.stablePool.assetIdA ? aSupply : bSupply
  const inSupply = assetOut === config.stablePool.assetIdA ? bSupply : aSupply
  const fee = config.stablePool.fee
  const x: number = amountToSwap + inSupply
  const y = getY(x, inSupply, outSupply)
  let dy: number = outSupply - y
  const dyFee: number = dy * (Math.round(fee / SCALE_FEE))
  dy = Math.max(dy - dyFee, 0)
  return dy / config.decimalScale
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

export const getStablePoolSupply = async (): Promise<[number, number, number]> => {
  const [aSupply, bSupply, lpSupply] = await Promise.all([
    getAssetBalance(config.stablePool.assetIdA, config.stablePool.appAddress),
    getAssetBalance(config.stablePool.assetIdB, config.stablePool.appAddress),
    getAssetBalance(config.stablePool.stablePoolAssetId, config.stablePool.appAddress)
  ])
  return [aSupply, bSupply, lpSupply]
}

export const getStableParticipation = async (address: string): Promise<number> => {
  const [poolBalance, addressBalance] = await Promise.all([
    await getAssetBalance(config.stablePool.stablePoolAssetId, config.stablePool.appAddress),
    await getAssetBalance(config.stablePool.stablePoolAssetId, address)
  ])
  const issued = TOTAL_SUPPLY - poolBalance
  return Number(((addressBalance * 100) / issued).toFixed(8))
}

export const calculateMint = async (amountA: number, amountB: number) => {
  const TOTAL_SUPPLY = 1e14

  const [aSupply, bSupply, lpSupply] = await getStablePoolSupply()
  const issued = TOTAL_SUPPLY - lpSupply
  const swapFee = config.stablePool.fee
  return tokensToMint(issued, aSupply, bSupply, amountA * SCALE_DECIMALS, amountB * SCALE_DECIMALS, swapFee) / SCALE_DECIMALS
}

export const calculateTokensToMint = async (amountA: number, amountB: number) => { // This funcion not use decimals multiplicator
  const TOTAL_SUPPLY = 1e14
  const [aSupply, bSupply, lpSupply] = await getStablePoolSupply()
  const issued = TOTAL_SUPPLY - lpSupply
  const swapFee = config.stablePool.fee
  return tokensToMint(issued, aSupply, bSupply, amountA, amountB, swapFee)
}

const tokensToMint = (
  issued: number,
  aSupply: number,
  bSupply: number,
  aAmount: number,
  bAmount: number,
  swapFee: number
) => {
  const oldK = aSupply * bSupply
  const newK = (aSupply + aAmount) * (bSupply + bAmount)
  const r = Math.sqrt(oldK) / issued
  const newIssued = Math.sqrt(newK) / r
  let tokenOut = newIssued - issued
  const newASupply = aSupply + aAmount
  const newBSupply = bSupply + bAmount
  const calculatedAAmount = (tokenOut * newASupply) / newIssued
  const caluclatedBAmount = (tokenOut * newBSupply) / newIssued
  let aSwapAmount = 0
  let bSwapAmount = 0
  let swapAmount = 0
  let feeAsPoolToken = 0
  if (aAmount > calculatedAAmount) {
    aSwapAmount = aAmount - calculatedAAmount
  }
  if (bAmount > caluclatedBAmount) {
    bSwapAmount = bAmount - caluclatedBAmount
  }

  if (aSwapAmount > bSwapAmount) {
    swapAmount = aSwapAmount
  } else {
    swapAmount = bSwapAmount
  }

  const feeAmount = (swapAmount * swapFee) / (100 - swapFee)
  if (aSwapAmount > bSwapAmount) {
    feeAsPoolToken = (feeAmount * newIssued) / (newASupply * 2)
  }

  if (bSwapAmount > aSwapAmount) {
    feeAsPoolToken = (feeAmount * newIssued) / (newBSupply * 2)
  }

  tokenOut = tokenOut - feeAsPoolToken
  return tokenOut
}
