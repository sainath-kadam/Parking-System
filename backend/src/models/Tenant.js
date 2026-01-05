import mongoose from 'mongoose';

const TenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },

    plan: {
      type: String,
      enum: ['FREE', 'BASIC', 'PRO'],
      default: 'FREE'
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

TenantSchema.index({ code: 1 }, { unique: true });

export default mongoose.model('Tenant', TenantSchema);