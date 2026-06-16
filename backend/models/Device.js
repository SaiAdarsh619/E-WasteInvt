import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      unique: true,
    },
    deviceType: {
      type: String,
      required: [true, 'Please specify the device type'],
      enum: ['Laptop', 'Desktop', 'Mobile', 'Printer', 'Monitor', 'Tablet', 'Server', 'Other'],
    },
    brand: {
      type: String,
      required: [true, 'Please add a brand'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Please add a model'],
      trim: true,
    },
    serialNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    source: {
      type: String,
      required: [true, 'Please specify the source'],
      trim: true,
    },
    arrivalDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Received', 'Processing', 'Dismantled', 'Completed'],
      default: 'Received',
    },
    notes: {
      type: String,
      trim: true,
    },
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-generate deviceId before saving
deviceSchema.pre('save', async function (next) {
  if (!this.deviceId) {
    const count = await mongoose.model('Device').countDocuments();
    const prefix = this.deviceType.substring(0, 3).toUpperCase();
    this.deviceId = `${prefix}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

const Device = mongoose.model('Device', deviceSchema);
export default Device;
