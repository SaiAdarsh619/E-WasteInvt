import mongoose from 'mongoose';

const componentSchema = new mongoose.Schema(
  {
    componentName: {
      type: String,
      required: [true, 'Please add a component name'],
      trim: true,
    },
    parentDevice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: [true, 'Please specify the parent device'],
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    condition: {
      type: String,
      enum: ['Working', 'Repairable', 'Scrap'],
      required: [true, 'Please specify the condition'],
    },
    testingResult: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: [
        'CPU',
        'RAM',
        'Storage',
        'Display',
        'Battery',
        'Motherboard',
        'Power Supply',
        'Fan',
        'Cable',
        'Casing',
        'Keyboard',
        'Touchpad',
        'Camera',
        'Speaker',
        'Other',
      ],
      default: 'Other',
    },
    extractedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Component = mongoose.model('Component', componentSchema);
export default Component;
