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
    case 'GET':
      try {
        const p = await Pool.findOne({ _id: id })

        if (!p) return res.status(400).json({ error: 'No Response for This Request' })

        res.status(200).json({
          id: p._id,
          poolName: p.poolName,
          assetA: p.assetA,
          assetB: p.assetB,
          poolAsset: p.poolAsset
        })
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    case 'PUT':
      try {
        console.log('PUT REQUEST')
        const pool = await Pool.findOneAndUpdate({ _id: id }, {
          assetA: req.body.assetA,
          assetB: req.body.assetB,
          poolAsset: req.body.poolAsset,
          poolName: req.body.poolName
        })
        res.status(200).json({
          id: pool._id,
          assetA: pool.assetA,
          assetB: pool.assetB,
          poolAsset: pool.poolAsset,
          poolName: pool.poolName
        })
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
