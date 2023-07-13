import { Schema, model, models } from 'mongoose'

const TransactionsBatchSchema = new Schema(
  {
    status: {
      type: String,
      required: [true, 'The status is required'],
      trim: true
    },
    sender: {
      type: String,
      required: [true, 'The sender is required'],
      trim: true
    },
    data: {
      type: [[String]],
      required: true
    },
    processed: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default models.TransactionsBatch || model('TransactionsBatch', TransactionsBatchSchema)
