import { Schema, model, models } from 'mongoose'

const PoolSchema = new Schema(
  {
    assetA: {
      amount: Number,
      id: Number,
      symbol: String
    },
    assetB: {
      amount: Number,
      id: Number,
      symbol: String
    },
    poolAsset: {
      amount: Number,
      id: Number,
      symbol: String
    },
    poolName: String
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default models.Pool || model('Pool', PoolSchema)
