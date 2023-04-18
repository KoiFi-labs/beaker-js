import { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '../../../src/utils/connection'
import Pool from '../../../src/models/Pool'

dbConnect()

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  switch (method) {
    case 'GET':
      try {
        const pools = await Pool.find({})
        res.status(200).json(pools)
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    case 'POST':
      try {
        const pool = await Pool.create({
          assetA: req.body.assetA,
          assetB: req.body.assetB,
          poolAsset: req.body.poolAsset,
          poolName: req.body.poolName
        })
        res.status(200).json(pool)
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    default:
      return res.status(400).json({ msg: 'This method is not supported' })
  }
}
