import mongoose from 'mongoose';

const ownerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

ownerSchema.index({ mobile: 1 }, { unique: true });

export default mongoose.model('Owner', ownerSchema);
