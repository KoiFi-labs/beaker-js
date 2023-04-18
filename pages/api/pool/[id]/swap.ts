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
        if (assetIdToBuy !== pool.asset.id && assetIdToBuy !== pool.assetB.id) throw new Error('Invalid assetToBuy')
        const assetToSellIsAssetA = assetIdToSell === pool.assetA.id
        if (assetToSellIsAssetA && amountToSell > pool.assetA.amount) throw new Error(`Insuffient balance in pool asset a ${pool.assetA.symbol}, ${pool.assetA.amount}`)
        if (!assetToSellIsAssetA && amountToSell > pool.assetB.amount) throw new Error(`Insuffient balance in pool asset b ${pool.assetB.symbol}, ${pool.assetA.amount}`)

        const updateAssetA = {
          id: pool.assetA.id,
          amount: pool.assetA.amount - amountToSell,
          symbol: pool.assetA.symbol
        }

        const updatedAssetB = {
          id: pool.assetB.id,
          amount: calculateAmountToSell,

        }

        const updatedPool = Pool.findOne
        res.status(200).json({})
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
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

    const assetInBalance: number = poolABalance // balances retrieved from AssetHolding.balance(this.address, assetIn)
    const assetOutBalance: number = poolBBalance // balances retrieved from AssetHolding.balance(this.address, assetOut)

    return calculate_swap(
      amt_in,
      assetIn,
      assetOut,
      assetInBalance,
      assetOutBalance
    )

const nT: number = 2 // number of assets in the pool
const scale: number = 1000
const maxLoopLimit: number = 255
const __A: number = 10
const A_PRECISION: number = 100
const A: number = __A * A_PRECISION

function calculate_swap(
  dx: number,
  assetIn: number,
  assetOut: number,
  assetInBalance: number,
  assetOutBalance: number
): [number, number] {
  /**
   * Returns the amount and fee of assetOut given an assetIn amount
   */
  const x: number = dx + assetInBalance
  const y: number = get_y(x, assetInBalance, assetOutBalance)
  let dy: number = assetOutBalance - y
  const dyFee: number = dy * (fee / scale)
  dy = Math.max(dy - dyFee, 0) // If dy negative return 0 assets out
  return [dy, dyFee]
}

function difference(a: number, b: number): number {
  if (a > b) {
    return a - b
  } else {
    return b - a
  }
}

function within1(a: number, b: number): boolean {
  return difference(a, b) <= 1
}

function get_d(poolABalance: number, poolBBalance: number): number {
  const s: number = poolABalance + poolBBalance

  if (s === 0) {
    return 0
  }

  let d: number = s
  const nA: number = A * nT

  let dp: number = d
  for (let i: number = 0; i < maxLoopLimit; i++) {
    dp *= d / (poolABalance * nT)
    dp *= d / (poolBBalance * nT)

    const prevD: number = d
    d =
      ((((nA * s) / A_PRECISION + dp * nT) * d) /
        (((nA - A_PRECISION) * d) / A_PRECISION + (nT + 1) * dp))
    if (within_1(d, prevD)) {
      console.log(d)
      return d
    }
  }

  throw new Error('D does not converge')
}

function get_y(x: number, assetInBalance: number, assetOutBalance: number): number {
  const d = get_d()

  const nT = 1 // I assume nT value is 1
  const A = assetOutBalance / assetInBalance
  const nA = nT * A

  let c = (d ** 2) / (x * nT)
  c = ((c * d) * A_PRECISION) / (nA * nT)

  const b = x + ((d * A_PRECISION) / nA)

  let y = d

  const maxLoopLimit = 1000 // I assume maxLoopLimit value is 1000

  for (let i = 0; i < maxLoopLimit; i++) {
    const yPrev = y
    y = ((y * y) + c) / (((y * 2) + b) - d)
    if (within_1(y, yPrev)) {
      console.log('i', i)
      return y
    }
  }

  throw new Error('Approximation did not converge')
}
