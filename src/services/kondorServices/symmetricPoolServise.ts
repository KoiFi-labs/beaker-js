import { contract } from './contract'
import algosdk from 'algosdk'
import { config } from '../../../config'
import { mySigner } from '../signer'

const TOTAL_SUPPLY = 1e14 // This value must be obtained from the smarth contract
const SCALE_DECIMALS = 1000000
const SCALE_FEE = 1000
const nT = 2 // number of assets in the pool
const maxLoopLimit = 250
const __A = 10
const A_PRECISION: number = 100
const A: number = __A * A_PRECISION

const client = new algosdk.Algodv2(config.network.token, config.network.server, config.network.port)

export const swap = async (addr: string, amount: number, assetOutput: number) => {
  const sp = await client.getTransactionParams().do()
  const abiContract = new algosdk.ABIContract(contract)

  const signer = await mySigner(addr)

  const commonParams = {
    appID: config.stablePool.appId,
    sender: addr,
    suggestedParams: sp,
    signer
  }

  const comp = new algosdk.AtomicTransactionComposer()

  const assetTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: addr,
    to: config.stablePool.appAddress,
    amount: amount * SCALE_DECIMALS,
    assetIndex: assetOutput,
    suggestedParams: { ...sp, fee: 9000 }
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
    ...commonParams
  })

  const results = await comp.execute(client, 2)
  return {
    result: results.methodResults[0].returnValue,
    txId: results.methodResults[0].txID
  }
}

export const mint = async (addr: string, aAmount: number, bAmount: number) => {
  const sp = await client.getTransactionParams().do()
  const abiContract = new algosdk.ABIContract(contract)
  const signer = await mySigner(addr)

  // const commonParams = {
  //   appID: config.stablePool.appId,
  //   sender: addr,
  //   suggestedParams: sp,
  //   signer
  // }

  const comp = new algosdk.AtomicTransactionComposer()

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
      config.stablePool.stablePoolAssetId,
      config.stablePool.assetIdA,
      config.stablePool.assetIdB
    ],
    appID: config.stablePool.appId,
    sender: addr,
    suggestedParams: { ...sp, fee: 4000 },
    signer
  })
  const results = await comp.execute(client, 2)
  console.log(results)
  return {
    result: results.methodResults[0].returnValue,
    txId: results.methodResults[0].txID
  }
}

export const optin = async (addr: string, amount: number, assetA: number) => {
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
    assetIndex: config.stablePool.stablePoolAssetId,
    suggestedParams: sp
  })

  comp.addTransaction({
    txn: optinTransfer,
    ...commonParams
  })

  const results = await comp.execute(client, 2)

  console.log('results', results)
  return {
    result: results.methodResults[0].returnValue,
    txId: results.methodResults[0].txID
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
    const abiContract = new algosdk.ABIContract(contract)
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

export const getSwapInput = async (outAmount: number, assetOut: number, assetIn: number) => {
  const [outSupply, inSupply] = await Promise.all([
    getAssetBalance(assetOut, config.stablePool.appAddress),
    getAssetBalance(assetIn, config.stablePool.appAddress)
  ])
  const factor = config.stablePool.scale - config.stablePool.fee
  return (outAmount * inSupply * config.stablePool.scale) / ((outSupply - outAmount) * factor)
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

export const calculateSwap = async (
  amount: number,
  assetOut: number
): Promise<[number, number]> => {
  const amountToSwap = Math.round(amount * config.decimalScale)
  // const outId = assetOut === config.stablePool.assetIdA ? config.stablePool.assetIdB : config.stablePool.assetIdA
  // const inId = assetOut === config.stablePool.assetIdA ? config.stablePool.assetIdA : config.stablePool.assetIdB
  // const inSupply = Math.round(await getAssetSupply(inId))
  // const outSupply = Math.round(await getAssetSupply(outId))
  const inSupply = 20100100000000
  const outSupply = 1771985408855
  const fee = config.stablePool.fee
  const x: number = amountToSwap + inSupply
  console.log('x', x)
  const y = getY(x, inSupply, outSupply)
  let dy: number = outSupply - y
  const dyFee: number = dy * (Math.round(fee / SCALE_FEE))
  dy = Math.max(dy - dyFee, 0)
  return [dy, dyFee]
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

  let cont = 0
  for (let i = 0; i < maxLoopLimit; i++) {
    let dp = d
    cont++
    dp = Math.round((dp * d) / (poolABalance * nT))
    dp = Math.round((dp * d) / (poolBBalance * nT))
    prevD = d
    d =
      Math.round(((Math.round((nA * s) / A_PRECISION) + (dp * nT)) * d) /
        (Math.round(((nA - A_PRECISION) * d) / A_PRECISION) + ((nT + 1) * dp)))
    if (within1(d, prevD)) {
      console.log('i adentro', cont, d, prevD)
      return d
    }
  }
  console.log('i afuera', cont)
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

export const getParticipation = async (address: string): Promise<number> => {
  const [poolBalance, addressBalance] = await Promise.all([
    await getAssetBalance(config.stablePool.stablePoolAssetId, config.stablePool.appAddress),
    await getAssetBalance(config.stablePool.stablePoolAssetId, address)
  ])
  const issued = TOTAL_SUPPLY - poolBalance
  return (addressBalance * 100) / issued
}

// function calculateSwap(
//   oldAsset1Reserves: number,
//   oldAsset2Reserves: number,
//   asset1Amount: number,
//   asset2Amount: number,
//   issuedPoolTokens: number,
//   totalFeeShare: number,
//   protocolFeeRatio: number
// ): {
//   calculatedAsset1Amount: number;
//   calculatedAsset2Amount: number;
//   swapAmount: number;
//   totalFeeAmount: number;
//   protocolFeeAmount: number;
//   poolersFeeAmount: number;
//   newAsset1Reserves: number;
//   newAsset2Reserves: number;
//   poolTokensOut: number;
// } {
//   const oldK = oldAsset1Reserves * oldAsset2Reserves;
//   const newK = (oldAsset1Reserves + asset1Amount) * (oldAsset2Reserves + asset2Amount);
//   const r = Math.sqrt(oldK) / issuedPoolTokens;
//   const newIssuedPoolTokens = Math.sqrt(newK) / r;
//   const poolTokensOut: number = newIssuedPoolTokens - issuedPoolTokens;

//   const newAsset1Reserves = oldAsset1Reserves + asset1Amount;
//   const newAsset2Reserves = oldAsset2Reserves + asset2Amount;

//   const calculatedAsset1Amount = Math.floor((poolTokensOut * newAsset1Reserves) / newIssuedPoolTokens);
//   const calculatedAsset2Amount = Math.floor((poolTokensOut * newAsset2Reserves) / newIssuedPoolTokens);
//   const asset1SwapAmount = asset1Amount - calculatedAsset1Amount;
//   const asset2SwapAmount = asset2Amount - calculatedAsset2Amount;
//   const swapAmount = Math.max(asset1SwapAmount, asset2SwapAmount);
//   const totalFeeAmount = (swapAmount * totalFeeShare) / (10000 - totalFeeShare);
//   const protocolFeeAmount = totalFeeAmount / protocolFeeRatio;
//   const poolersFeeAmount = totalFeeAmount - protocolFeeAmount;

//   if (asset1SwapAmount > asset2SwapAmount) {
//     const feeAsPoolTokens = (totalFeeAmount * newIssuedPoolTokens) / (newAsset1Reserves * 2);
//     const newAsset1Reserves = newAsset1Reserves - protocolFeeAmount;
//     const poolTokensOut = poolTokensOut - feeAsPoolTokens;

//     return {
//       calculatedAsset1Amount,
//       calculatedAsset2Amount,
//       swapAmount,
//       totalFeeAmount,
//       protocolFeeAmount,
//       poolersFeeAmount,
//       newAsset1Reserves,
//       newAsset2Reserves,
//       poolTokensOut,
//     };
//   } else if (asset2SwapAmount > asset1SwapAmount) {
//     const feeAsPoolTokens = (totalFeeAmount * newIssuedPoolTokens) / (newAsset2Reserves * 2);
//     const newAsset2Reserves = newAsset2Reserves - protocolFeeAmount;
//     const poolTokensOut = poolTokensOut - feeAsPoolTokens;

//     return {
//       calculatedAsset1Amount,
//       calculatedAsset2Amount,
//       swapAmount,
//       totalFeeAmount,
//       protocolFeeAmount,
//       poolersFeeAmount,
//       newAsset1Reserves,
//       newAsset2Reserves,
//       poolTokensOut,
//     };
//   } else {
//     return {
//       calculatedAsset1Amount,
//       calculatedAsset2,
//       calculatedAsset1Amount,
//       calculatedAsset2Amount,
//       swapAmount,
//       totalFeeAmount,
//       protocolFeeAmount,
//       poolersFeeAmount,
//       newAsset1Reserves,
//       newAsset2Reserves,
//       poolTokensOut,
//     };
//   }
