import mongoose from 'mongoose';
import ParkingEntry from '../models/ParkingEntry.js';
import { PARKING_STATUS } from '../utils/constants.js';

import { upsertDriver } from '../services/driver.service.js';
import {
  closeAssignment,
  createAssignment
} from '../services/assignment.service.js';
import { checkOutParkingEntry } from '../services/parking.service.js';
import { logAudit } from '../services/audit.service.js';

export async function checkOutVehicle(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { vehicleNumber, driver } = req.body;

    const entry = await ParkingEntry.findOne({
      status: PARKING_STATUS.IN
    }).populate('assignmentId').session(session);

    if (!entry) throw new Error('Active parking not found');

    const assignment = entry.assignmentId;

    if (driver) {
      const updatedDriver = await upsertDriver(driver, session);

      if (updatedDriver._id.toString() !== assignment.driverId.toString()) {
        await closeAssignment(assignment, session);

        const newAssign = await createAssignment({
          vehicleId: assignment.vehicleId,
          ownerId: assignment.ownerId,
          driverId: updatedDriver._id
        }, session);

        entry.assignmentId = newAssign._id;

        await logAudit({
          entity: 'VehicleAssignment',
          entityId: newAssign._id,
          action: 'DRIVER_REASSIGNED_AT_CHECKOUT',
          performedBy: req.user.userId
        }, session);
      }
    }

    const updated = await checkOutParkingEntry({
      parkingEntry: entry,
      ratePerHour: entry.ratePerHour,
      graceMinutes: entry.graceMinutes
    });

    await logAudit({
      entity: 'ParkingEntry',
      entityId: updated._id,
      action: 'CHECK_OUT',
      performedBy: req.user.userId
    }, session);

    await session.commitTransaction();
    res.json(updated);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
}