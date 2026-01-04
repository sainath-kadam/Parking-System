import mongoose from 'mongoose';

const TenantBillingLedgerSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: ['CHARGE', 'PAYMENT', 'ADJUSTMENT'],
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    cycle: {
      type: String,
      enum: ['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY'],
      required: function () {
        return this.type === 'CHARGE';
      }
    },

    periodStart: {
      type: Date
    },

    periodEnd: {
      type: Date
    },

    reference: {
      type: String,
      trim: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

// indexes for billing queries
TenantBillingLedgerSchema.index({ tenantId: 1, createdAt: -1 });
TenantBillingLedgerSchema.index({ tenantId: 1, type: 1 });

export default mongoose.model('TenantBillingLedger', TenantBillingLedgerSchema);