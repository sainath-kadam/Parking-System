import VehicleAssignment from '../models/VehicleAssignment.js';
import { getISTNow } from '../utils/istTime.js';

export async function getActiveAssignment(vehicleId, session) {
  return VehicleAssignment.findOne({
    vehicleId,
    isActive: true
  }).session(session);
}

export async function closeAssignment(assignment, session) {
  assignment.isActive = false;
  assignment.assignedTo = getISTNow();
  await assignment.save({ session });
}

export async function createAssignment(data, session) {
  const [created] = await VehicleAssignment.create(
    [{
      ...data,
      assignedFrom: getISTNow(),
      isActive: true
    }],
    { session }
  );
  return created;
}