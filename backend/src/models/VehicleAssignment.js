import mongoose from 'mongoose';

const vehicleAssignmentSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true
    },
    assignedFrom: { type: Date, required: true },
    assignedTo: { type: Date },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

vehicleAssignmentSchema.index(
  { vehicleId: 1, isActive: 1 },
  { partialFilterExpression: { isActive: true } }
);

export default mongoose.model(
  'VehicleAssignment',
  vehicleAssignmentSchema
);
