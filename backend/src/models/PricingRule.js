import mongoose from 'mongoose';

const pricingRuleSchema = new mongoose.Schema(
  {
    vehicleType: { type: String, required: true },
    rateConfig: {
      firstHour: { type: Number, required: true },
      secondHour: { type: Number, required: true },
      thirdHour: { type: Number, required: true },
      afterThirdHour: { type: Number, required: true }
    },
    graceMinutes: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('PricingRule', pricingRuleSchema);
