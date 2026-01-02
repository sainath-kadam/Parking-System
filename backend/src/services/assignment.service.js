import VehicleAssignment from '../models/VehicleAssignment.js';
import { getISTNow } from '../utils/istTime.js';

export async function getActiveAssignment(vehicleId) {
  return VehicleAssignment.findOne({
    vehicleId,
    isActive: true
  });
}

export async function closeAssignment(assignment) {
  assignment.isActive = false;
  assignment.assignedTo = getISTNow();
  await assignment.save();
}

export async function createAssignment({
  vehicleId,
  ownerId,
  driverId
}) {
  return VehicleAssignment.create({
    vehicleId,
    ownerId,
    driverId,
    assignedFrom: getISTNow(),
    isActive: true
  });
}
