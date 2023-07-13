import { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '../../../src/utils/connection'
import TransactionsBatch from '../../../src/models/TransactionsBatch'

dbConnect()

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  switch (method) {
    case 'GET':
      try {
        const batches = await TransactionsBatch.find({})
        res.status(200).json(batches.map(b => ({
          id: b._id,
          status: b.status,
          data: b.data,
          sender: b.sender,
          createdAt: b.createdAt,
          processed: b.processed,
          updatedAt: b.updatedAt
        })))
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    case 'POST':
      try {
        const b = await TransactionsBatch.create({
          status: req.body.status,
          data: req.body.data,
          sender: req.body.sender
        })
        res.status(200).json({
          id: b._id,
          status: b.status,
          data: b.data,
          sender: b.sender,
          createdAt: b.createdAt,
          updatedAt: b.updatedAt
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
