import { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '../../../../src/utils/connection'
import Pool from '../../../../src/models/Pool'

dbConnect()

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
    query: { id }
  } = req

  switch (method) {
    case 'POST':
      try {
        const amountToSell = req.body.amount
        const assetIdToSell = req.body.assetIdToSell
        const assetIdToBuy = req.body.assetIdToBuy
        const pool = await Pool.findOne({ _id: id })
        if (!pool) throw new Error('Pool not found')
        if (assetIdToBuy === assetIdToSell) throw new Error('Asset ids can not be the same')
        if (assetIdToSell !== pool.assetA.id && assetIdToSell !== pool.assetB.id) throw new Error('Invalid assetToSell')
        if (assetIdToBuy !== pool.assetA.id && assetIdToBuy !== pool.assetB.id) throw new Error('Invalid assetToBuy')
        const assetToSellIsAssetA = assetIdToSell === pool.assetA.id
        if (assetToSellIsAssetA && amountToSell > pool.assetA.amount) throw new Error(`Insuffient balance in pool asset a ${pool.assetA.symbol}, ${pool.assetA.amount}`)
        if (!assetToSellIsAssetA && amountToSell > pool.assetB.amount) throw new Error(`Insuffient balance in pool asset b ${pool.assetB.symbol}, ${pool.assetA.amount}`)
        const assetToSellBalance = assetToSellIsAssetA ? pool.assetA.amount : pool.assetB.amount
        const assetToBuyBalance = assetToSellIsAssetA ? pool.assetB.amount : pool.assetA.amount
        const [amountToBuy] = calculateSwap(amountToSell, assetToSellBalance, assetToBuyBalance, assetToSellIsAssetA)

        const amountAssetA = assetToSellIsAssetA ? pool.assetA.amount + amountToSell : pool.assetA.amount - amountToBuy
        const amountAssetB = assetToSellIsAssetA ? pool.assetB.amount - amountToBuy : pool.assetB.amount + amountToSell

        const updatedAssetA = {
          id: pool.assetA.id,
          amount: amountAssetA,
          symbol: pool.assetA.symbol
        }

        const updatedAssetB = {
          id: pool.assetB.id,
          amount: amountAssetB,
          symbol: pool.assetB.symbol
        }

        const updatedPool = await Pool.findOneAndUpdate({ _id: pool._id }, { assetA: updatedAssetA, assetB: updatedAssetB }, { new: true })
        res.status(200).json({ updatedPool })
      } catch (error) {
        res.status(400).json(error?.toString())
      }
      break
    case 'DELETE':
      try {
        console.log('DELETE REQUEST')
        await Pool.findOneAndDelete({ _id: id })
        res.status(200).json({ poolDeleted: id })
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    default:
      return res.status(400).json({ msg: 'This method is not supported' })
  }
}

const fee: number = 3 // constant fee: Final[Expr] = Int(_fee)
const nT: number = 2 // number of assets in the pool
const scale: number = 1000
const maxLoopLimit: number = 1000
const __A: number = 10
const A_PRECISION: number = 100
const A: number = __A * A_PRECISION

function calculateSwap (
  dx: number,
  assetInBalance: number,
  assetOutBalance: number,
  assetInIsABalance: boolean
): [number, number] {
  const x: number = dx + assetInBalance
  const y: number = getY(x, assetInBalance, assetOutBalance, assetInIsABalance)
  let dy: number = assetOutBalance - y
  const dyFee: number = dy * (fee / scale)
  dy = Math.max(dy - dyFee, 0) // If dy negative return 0 assets out
  // console.log('amount after swap asset_in: ', dx + assetInBalance)
  // console.log('amount after swap asset_out: ', assetOutBalance - dy)
  return [dy, dyFee]
}

function difference (a: number, b: number): number {
  return a > b ? a - b : b - a
}

function within1 (a: number, b: number): boolean {
  return difference(a, b) <= 1
}

function getD (poolABalance: number, poolBBalance: number): number {
  const s: number = poolABalance + poolBBalance
  if (s === 0) return 0
  let d: number = s
  const nA: number = A * nT
  let dp: number = d
  let dInitial = 0
  for (let i: number = 0; i < maxLoopLimit; i++) {
    dp *= d / (poolABalance * nT)
    dp *= d / (poolBBalance * nT)
    const prevD: number = d
    if (i === 0) {
      dInitial = d
    }
    d =
      ((((nA * s) / A_PRECISION + dp * nT) * d) /
        (((nA - A_PRECISION) * d) / A_PRECISION + (nT + 1) * dp))
    if (within1(d, prevD)) {
      // console.log('d en la vuelta', i, ': ', d)
      // console.log('diferencia en d', Math.abs(dInitial - d))
      return d
    }
  }
  console.log('dInitial', dInitial)
  console.log('A Balance', poolABalance)
  console.log('B Balance', poolBBalance)
  console.log('last d value', d)
  throw new Error('D does not converge')
}

function getY (x: number, assetInBalance: number, assetOutBalance: number, assetInIsABalance: boolean): number {
  const d = assetInIsABalance ? getD(assetInBalance, assetOutBalance) : getD(assetOutBalance, assetInBalance)

  const nT = 2
  const nA = nT * A

  let c = (d ** 2) / (x * nT)
  c = ((c * d) * A_PRECISION) / (nA * nT)
  const b = x + ((d * A_PRECISION) / nA)

  let y = d
  let yInitial = 0

  for (let i = 0; i < maxLoopLimit; i++) {
    const yPrev = y
    y = ((y * y) + c) / (((y * 2) + b) - d)

    if (i === 0) {
      yInitial = y
      // console.log('y en la primer vuelta :', y)
    }

    if (within1(y, yPrev)) {
      // console.log('y en la ', i, ': ', y)
      // console.log('diferencia de y :', Math.abs(yInitial - y))
      return y
    }
  }
  console.log('yInitial value: ', yInitial)
  throw new Error('Approximation did not converge')
}
