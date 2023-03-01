import { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '../../src/utils/connection'
import Balance from '../../src/models/Balance'

dbConnect()

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  switch (method) {
    case 'GET':
      try {
        console.log('GET BALANCE REQUEST')
        const balances = await Balance.find({})
        res.status(200).json(balances)
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    case 'POST':
      try {
        console.log('POST BALANCE REQUEST')
        const balance = await Balance.create({
          _id: req.body.id,
          assetId: req.body.assetId,
          assetSymbol: req.body.assetSymbol,
          amount: req.body.amount
        })
        res.status(200).json(balance)
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    default:
      return res.status(400).json({ msg: 'This method is not supported' })
  }
}
