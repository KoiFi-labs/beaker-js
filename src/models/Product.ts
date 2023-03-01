import { Schema, model, models } from 'mongoose'

const ProductSchema = new Schema(
  {
    _id: {
      type: Number,
      required: [true, 'The unique id is required'],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'The name is required'],
      trim: true
    },
    assets: [{
      id: Number,
      symbol: String,
      amount: Number
    }],
    value: {
      type: Number,
      required: [true, 'The value is required']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default models.Product || model('Product', ProductSchema)
