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
  try {
    const { vehicleNumber, driver } = req.body;

    const entry = await ParkingEntry.findOne({
      status: PARKING_STATUS.IN
    }).populate('assignmentId');

    if (!entry) {
      return res.status(404).json({ message: 'Active parking entry not found' });
    }

    const assignment = entry.assignmentId;

    // 🔁 Driver reassignment logic
    if (driver) {
      const updatedDriver = await upsertDriver(driver);

      if (updatedDriver._id.toString() !== assignment.driverId.toString()) {
        await closeAssignment(assignment);

        const newAssignment = await createAssignment({
          vehicleId: assignment.vehicleId,
          ownerId: assignment.ownerId,
          driverId: updatedDriver._id
        });

        entry.assignmentId = newAssignment._id;

        await logAudit({
          entity: 'VehicleAssignment',
          entityId: newAssignment._id,
          action: 'DRIVER_REASSIGNED_AT_CHECKOUT',
          performedBy: req.user.userId
        });
      }
    }

    const updatedEntry = await checkOutParkingEntry({
      parkingEntry: entry,
      ratePerHour: entry.ratePerHour,
      graceMinutes: entry.graceMinutes
    });

    await logAudit({
      entity: 'ParkingEntry',
      entityId: updatedEntry._id,
      action: 'CHECK_OUT',
      oldValue: { status: PARKING_STATUS.IN },
      newValue: updatedEntry,
      performedBy: req.user.userId
    });

    res.json(updatedEntry);
  } catch (err) {
    res.status(500).json({ message: 'Check-out failed' });
  }
}