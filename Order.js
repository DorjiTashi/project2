import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    items: [
      {
        id: Number,
        name: String,
        description: String,
        price: String,
        image: String,
      },
    ],
    paymentMethod: {
      type: String,
      enum: ['BOB', 'BNB', 'DK'],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Avoid re-registering model during hot reload in dev
export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
