import { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '../../src/utils/connection'
import Price from '../../src/models/Price'

dbConnect()

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  switch (method) {
    case 'GET':
      try {
        console.log('GET PRICE REQUEST')
        const prices = await Price.find({})
        res.status(200).json(prices)
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    case 'POST':
      try {
        console.log('POST PRICE REQUEST')
        const price = await Price.create({
          assetSymbol: req.body.assetSymbol,
          price: req.body.price
        })
        res.status(200).json(price)
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    default:
      return res.status(400).json({ msg: 'This method is not supported' })
  }
}
