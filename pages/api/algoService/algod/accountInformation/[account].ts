import { NextApiRequest, NextApiResponse } from 'next'
import algoSdk from 'algosdk'
const algoClient = new algoSdk.Algodv2(process.env.ALGO_TOKEN!, process.env.ALGO_SERVER!, '')

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
    query: { account }
  } = req

  switch (method) {
    case 'GET':
      try {
        if (typeof account !== 'string') throw new Error('Invalid account')
        const accountInfo = await algoClient.accountInformation(account).do()
        res.status(200).json(accountInfo)
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    default:
      return res.status(400).json({ msg: 'This method is not supported' })
  }
}
