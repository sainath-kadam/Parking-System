import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    vehicleType: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant', 
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

vehicleSchema.index({ tenantId: 1, vehicleNumber: 1 }, { unique: true });

export default mongoose.model('Vehicle', vehicleSchema);
