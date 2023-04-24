import { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '../../../../src/utils/connection'
import Pool from '../../../../src/models/Pool'
import { AxiosError } from 'axios'

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
        const pool = await Pool.findOne({ _id: id })

        const updatedPool = await Pool.findOneAndUpdate({ _id: id }, {
          assetA: {
            id: pool.assetA.id,
            symbol: pool.assetA.symbol,
            amount: 100000000000000
          },
          assetB: {
            id: pool.assetB.id,
            symbol: pool.assetB.symbol,
            amount: 100000000000000
          },
          poolAsset: pool.poolAsset,
          poolName: pool.poolName
        }, { new: true })
        res.status(200).json({
          id: updatedPool._id,
          assetA: updatedPool.assetA,
          assetB: updatedPool.assetB,
          poolAsset: updatedPool.poolAsset,
          poolName: updatedPool.poolName
        })
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error?.response?.config)
          console.log(error?.response?.data)
          res.status(400).json({ error: error?.response })
        }
        res.status(400).json({ error })
      }
      break
    default:
      return res.status(400).json({ msg: 'This method is not supported' })
  }
}
