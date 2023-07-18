import { NextApiRequest, NextApiResponse } from 'next'
import algoSdk from 'algosdk'
const algoIndexer = new algoSdk.Indexer(process.env.ALGO_TOKEN!, process.env.ALGO_INDEXER, '')

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
    query: { account, limit }
  } = req

  switch (method) {
    case 'GET':
      try {
        if (typeof account !== 'string') throw new Error('Invalid account')
        const txs = await algoIndexer.searchForTransactions().address(account).limit(Number(limit)).do()
        res.status(200).json(txs)
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    default:
      return res.status(400).json({ msg: 'This method is not supported' })
  }
}
