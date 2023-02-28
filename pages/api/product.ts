import { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '../../src/utils/connection'
import Product from '../../src/models/Product'

dbConnect()

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  switch (method) {
    case 'GET':
      try {
        console.log('GET REQUEST')
        const products = await Product.find({})
        res.status(200).json(products.map(p => ({
          id: p._id,
          name: p.name,
          assets: p.assets
        })))
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    case 'POST':
      try {
        console.log('POST REQUEST')
        const product = await Product.create({
          _id: req.body.id,
          assets: req.body.assets,
          name: req.body.name
        })
        res.status(200).json({
          id: product._id,
          assets: product.assets,
          name: product.name
        })
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    default:
      return res.status(400).json({ msg: 'This method is not supported' })
  }
}
