import { Schema, model, models } from 'mongoose'

const BalanceSchema = new Schema(
  {
    assetId: {
      type: Number,
      required: [true, 'AssetId is required'],
      trim: true
    },
    assetSymbol: {
      type: String,
      required: [true, 'AssetSymbol is required'],
      trim: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default models.Balance || model('Balance', BalanceSchema)
