import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

driverSchema.index({ mobile: 1 }, { unique: true });

export default mongoose.model('Driver', driverSchema);
