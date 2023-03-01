import { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '../../../src/utils/connection'
import Balance from '../../../src/models/Balance'

dbConnect()

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
    query: { symbol }
  } = req

  switch (method) {
    case 'GET':
      try {
        console.log('GET BALANCE REQUEST')
        const b = await Balance.findOne({ assetSymbol: req.body.assetSymbol })

        if (!b) return res.status(400).json({ error: 'No Response for This Request' })

        res.status(200).json(b)
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    case 'PUT':
      try {
        console.log('PUT BALANCE REQUEST')
        const balance = await Balance.findOneAndUpdate({ symbol }, {
          amount: req.body.amount
        }, { new: true })
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
