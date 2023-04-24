import { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '../../../../src/utils/connection'
import Pool from '../../../../src/models/Pool'
import { to } from './to'
import axios from 'axios'
const CLIENT_NAME: string = process.env.BACKEND_URL ?? ''

dbConnect()

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
    query: { id }
  } = req

  switch (method) {
    case 'POST':
      try {
        const p = await Pool.findOne({ _id: id })
        if (!p) return res.status(400).json({ error: 'No Response for This Request' })

        for (let i = 0; i < to.length; i++) {
          console.log('processing ', i, '...')
          const assetIdToSell = to[i].asset === 'USDC' ? 159719100 : 159703771
          const assetIdToBuy = to[i].asset === 'USDC' ? 159703771 : 159719100
          const params = {
            method: 'POST',
            url: `${CLIENT_NAME}/api/pool/${id}/swap`,
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              assetIdToSell,
              assetIdToBuy,
              amount: Math.round(to[i].value * 1000000)
            }
          }
          await axios(params)
        }

        res.status(200).json({ response: 'ok' })
      } catch (error) {
        res.status(400).json({ error })
      }
      break
    default:
      return res.status(400).json({ msg: 'This method is not supported' })
  }
}
