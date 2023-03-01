import { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '../../../src/utils/connection'
import Product from '../../../src/models/Product'

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
        console.log('GET REQUEST')
        const p = await Product.findOne({ _id: id })

        if (!p) return res.status(400).json({ error: 'No Response for This Request' })

        res.status(200).json({
          id: p._id,
          name: p.name,
          assets: p.assets,
          value: p.value
        })
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    case 'PUT':
      try {
        console.log('PUT REQUEST')
        const product = await Product.findOneAndUpdate({ _id: id }, {
          assets: req.body.assets,
          name: req.body.namem,
          value: req.body.value
        })
        res.status(200).json({
          id: product._id,
          assets: product.assets,
          name: product.name,
          value: product.value
        })
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    case 'DELETE':
      try {
        console.log('DELETE REQUEST')
        await Product.findOneAndDelete({ _id: id })
        res.status(200).json({ productDelected: id })
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    default:
      return res.status(400).json({ msg: 'This method is not supported' })
  }
}
