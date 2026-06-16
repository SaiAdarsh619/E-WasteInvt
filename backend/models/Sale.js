import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema(
  {
    component: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Component',
      required: [true, 'Please specify the component'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please specify quantity'],
      min: 1,
    },
    salePrice: {
      type: Number,
      required: [true, 'Please specify the sale price'],
      min: 0,
    },
    buyer: {
      type: String,
      trim: true,
      default: 'Walk-in Customer',
    },
    saleDate: {
      type: Date,
      default: Date.now,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Sale = mongoose.model('Sale', saleSchema);
export default Sale;
