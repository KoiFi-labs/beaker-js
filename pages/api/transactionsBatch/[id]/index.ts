import { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '../../../../src/utils/connection'
import TransactionsBatch from '../../../../src/models/TransactionsBatch'

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
        const b = await TransactionsBatch.findOne({ _id: id })

        if (!b) return res.status(400).json({ error: 'No Response for This Request' })

        res.status(200).json({
          id: b._id,
          status: b.status,
          data: b.data,
          processed: b.processed,
          sender: b.sender,
          createdAt: b.createdAt,
          updatedAt: b.updatedAt
        })
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    case 'PUT':
      try {
        if (typeof req.body.processed !== 'number') throw new Error('processed is required')
        const b = await TransactionsBatch.findOneAndUpdate({ _id: id }, {
          processed: req.body.processed
        })
        res.status(200).json({
          id: b._id,
          status: b.status,
          data: b.data,
          sender: b.sender,
          processed: b.processed,
          createdAt: b.createdAt,
          updatedAt: b.updatedAt
        })
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    case 'DELETE':
      try {
        console.log('DELETE REQUEST')
        await TransactionsBatch.findOneAndDelete({ _id: id })
        res.status(200).json({ TransactionsBatchDeleted: id })
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'No Response for This Request' })
      }
      break
    default:
      return res.status(400).json({ msg: 'This method is not supported' })
  }
}
