import mongoose from 'mongoose';
import ParkingEntry from '../models/ParkingEntry.js';
import { getISTNow } from '../utils/istTime.js';
import { PARKING_STATUS } from '../utils/constants.js';

import { upsertOwner } from '../services/owner.service.js';
import { upsertDriver } from '../services/driver.service.js';
import { getOrCreateVehicle } from '../services/vehicle.service.js';
import { getActiveAssignment, createAssignment } from '../services/assignment.service.js';
import { logAudit } from '../services/audit.service.js';

export async function checkInVehicle(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      vehicleNumber,
      vehicleType,
      owner,
      driver,
      ratePerHour,
      graceMinutes = 0
    } = req.body;

    const tenantId = req.tenantId;

    const vehicle = await getOrCreateVehicle(
      { vehicleNumber, vehicleType, tenantId },
      session
    );

    const existing = await getActiveAssignment(
      { vehicleId: vehicle._id, tenantId },
      session
    );
    if (existing) throw new Error('Vehicle already parked');

    const ownerDoc = await upsertOwner(
      { ...owner, tenantId },
      session
    );

    const driverDoc = await upsertDriver(
      { ...driver, tenantId },
      session
    );

    const assignment = await createAssignment(
      {
        vehicleId: vehicle._id,
        ownerId: ownerDoc._id,
        driverId: driverDoc._id,
        tenantId
      },
      session
    );

    const [entry] = await ParkingEntry.create(
      [
        {
          tenantId,
          vehicleId: vehicle._id,
          assignmentId: assignment._id,
          inTime: getISTNow(),
          ratePerHour,
          graceMinutes,
          operatorId: req.user.userId,
          status: PARKING_STATUS.IN
        }
      ],
      { session }
    );

    await logAudit(
      {
        tenantId,
        entity: 'ParkingEntry',
        entityId: entry._id,
        action: 'CHECK_IN',
        newValue: entry,
        performedBy: req.user.userId
      },
      session
    );

    await session.commitTransaction();
    res.status(201).json(entry);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
}