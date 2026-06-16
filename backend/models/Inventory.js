import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    component: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Component',
      required: [true, 'Please specify the component'],
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    storageLocation: {
      type: String,
      required: [true, 'Please specify a storage location'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Sold', 'Disposed'],
      default: 'Available',
    },
  },
  { timestamps: true }
);

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;
