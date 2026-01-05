import mongoose from 'mongoose';

const TenantBillingLogSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true
    },

    action: {
      type: String,
      enum: [
        'BILLING_CYCLE_CHARGE',
        'PAYMENT_RECORDED',
        'ADJUSTMENT_APPLIED'
      ],
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    balanceAfter: {
      type: Number,
      required: true,
      min: 0
    },

    note: {
      type: String,
      trim: true
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

TenantBillingLogSchema.index({ tenantId: 1, createdAt: -1 });
TenantBillingLogSchema.index({ tenantId: 1, action: 1 });

export default mongoose.model('TenantBillingLog', TenantBillingLogSchema);
