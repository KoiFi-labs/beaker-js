import { NextApiRequest, NextApiResponse } from 'next'
import algoSdk from 'algosdk'

const algoIndexer = new algoSdk.Indexer(process.env.ALGO_TOKEN!, process.env.ALGO_INDEXER, '')

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
    query: { assetId }
  } = req

  switch (method) {
    case 'GET':
      try {
        if (typeof assetId === 'undefined') throw new Error('Invalid assetId')
        const assetInfo = await algoIndexer.lookupAssetByID(Number(assetId)).do()
        res.status(200).json(assetInfo)
      } catch (error) {
        res.status(404).json({ error: 'asset not found' })
      }
      break
    default:
      return res.status(400).json({ msg: 'This method is not supported' })
  }
}
