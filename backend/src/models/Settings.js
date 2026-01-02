import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
      trim: true
    },

    logoUrl: {
      type: String,
      trim: true
    },

    address: {
      type: String,
      required: true,
      trim: true
    },

    contactNumbers: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: 'At least one contact number is required'
      }
    },

    currency: {
      type: String,
      default: 'INR',
      immutable: true
    },

    timezone: {
      type: String,
      default: 'IST',
      immutable: true
    },

    receiptTerms: {
      type: String,
      required: true
    },

    billTerms: {
      type: String
    },

    isActive: {
      type: Boolean,
      default: true
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
    versionKey: false
  }
);

/**
 * Enforce SINGLE settings document
 */
settingsSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('Settings').countDocuments();
    if (count > 0) {
      throw new Error('Only one settings document is allowed');
    }
  }
  next();
});

export default mongoose.model('Settings', settingsSchema);
