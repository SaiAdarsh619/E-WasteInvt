import mongoose from 'mongoose';

const disposalSchema = new mongoose.Schema(
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
    disposalType: {
      type: String,
      enum: ['Recycled', 'Scrap'],
      required: [true, 'Please specify disposal type'],
    },
    disposalDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Disposal = mongoose.model('Disposal', disposalSchema);
export default Disposal;
