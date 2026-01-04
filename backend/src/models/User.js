import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    role: {
      type: String,
      enum: ['ADMIN', 'OPERATOR', 'SYSTEM_OWNER'],
      required: true
    },
    passwordHash: { type: String, required: true },
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

userSchema.index({ tenantId: 1, mobile: 1 }, { unique: true });

export default mongoose.model('User', userSchema);
