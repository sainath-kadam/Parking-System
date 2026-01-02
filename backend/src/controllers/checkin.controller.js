import mongoose from 'mongoose';
import ParkingEntry from '../models/ParkingEntry.js';
import { getISTNow } from '../utils/istTime.js';
import { PARKING_STATUS } from '../utils/constants.js';

import { upsertOwner } from '../services/owner.service.js';
import { upsertDriver } from '../services/driver.service.js';
import { getOrCreateVehicle } from '../services/vehicle.service.js';
import {
  getActiveAssignment,
  createAssignment
} from '../services/assignment.service.js';
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

    const vehicle = await getOrCreateVehicle({ vehicleNumber, vehicleType }, session);

    const existingAssignment = await getActiveAssignment(vehicle._id, session);
    if (existingAssignment) {
      throw new Error('Vehicle already parked');
    }

    const ownerDoc = await upsertOwner(owner, session);
    const driverDoc = await upsertDriver(driver, session);

    const assignment = await createAssignment({
      vehicleId: vehicle._id,
      ownerId: ownerDoc._id,
      driverId: driverDoc._id
    }, session);

    const entry = await ParkingEntry.create([{
      vehicleId: vehicle._id,
      assignmentId: assignment._id,
      inTime: getISTNow(),
      ratePerHour,
      graceMinutes,
      operatorId: req.user.userId,
      status: PARKING_STATUS.IN
    }], { session });

    await logAudit({
      entity: 'ParkingEntry',
      entityId: entry[0]._id,
      action: 'CHECK_IN',
      newValue: entry[0],
      performedBy: req.user.userId
    }, session);

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(entry[0]);

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
}