import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    vehicleType: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

vehicleSchema.index({ vehicleNumber: 1 }, { unique: true });

export default mongoose.model('Vehicle', vehicleSchema);
