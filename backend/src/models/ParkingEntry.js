import mongoose from 'mongoose';

const parkingEntrySchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    },
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VehicleAssignment',
      required: true
    },
    inTime: { type: Date, required: true },
    outTime: { type: Date },
    durationMinutes: { type: Number },
    amount: { type: Number },
    /*
    pricingRuleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PricingRule',
      required: true
    },
    */
    ratePerHour: {
        type: Number
   },
    calculatedAmount: {
        type: Number,
    },
    finalAmount: {
        type: Number
    },

    discountAmount: {
        type: Number,
        default: 0
    },  
    operatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['IN', 'OUT'],
      default: 'IN'
    }
  },
  { timestamps: true }
);

parkingEntrySchema.index({ status: 1, inTime: 1 });

export default mongoose.model('ParkingEntry', parkingEntrySchema);
