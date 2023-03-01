import { Schema, model, models } from 'mongoose'

const PriceSchema = new Schema(
  {
    assetSymbol: {
      type: String,
      required: [true, 'Asset symbol is required'],
      trim: true
    },
    price: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default models.Price || model('Price', PriceSchema)
