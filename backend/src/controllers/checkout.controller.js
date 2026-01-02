import mongoose from 'mongoose';

import Vehicle from '../models/Vehicle.js';
import ParkingEntry from '../models/ParkingEntry.js';

import { PARKING_STATUS } from '../utils/constants.js';

import { upsertDriver } from '../services/driver.service.js';
import {closeAssignment, createAssignment} from '../services/assignment.service.js';

import { checkOutParkingEntry } from '../services/parking.service.js';
import { logAudit } from '../services/audit.service.js';

export async function checkOutVehicle(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { vehicleNumber, driver, finalAmount } = req.body;

    // resolve vehicle
    const vehicle = await Vehicle.findOne({ vehicleNumber }).session(session);
    if (!vehicle) throw new Error('Vehicle not found');

    // fetch active parking entry for this vehicle
    const entry = await ParkingEntry.findOne({
      vehicleId: vehicle._id,
      status: PARKING_STATUS.IN
    })
      .populate('assignmentId')
      .session(session);

    if (!entry) throw new Error('Vehicle is not currently parked');

    const assignment = entry.assignmentId;

    // reassign driver if changed
    if (driver) {
      const updatedDriver = await upsertDriver(driver, session);

      if (updatedDriver._id.toString() !== assignment.driverId.toString()) {
        await closeAssignment(assignment, session);

        const newAssignment = await createAssignment(
          {
            vehicleId: assignment.vehicleId,
            ownerId: assignment.ownerId,
            driverId: updatedDriver._id
          },
          session
        );

        entry.assignmentId = newAssignment._id;

        await logAudit(
          {
            entity: 'VehicleAssignment',
            entityId: newAssignment._id,
            action: 'DRIVER_REASSIGNED_AT_CHECKOUT',
            performedBy: req.user.userId
          },
          session
        );
      }
    }

    // system calculation
    const updatedEntry = await checkOutParkingEntry({
      parkingEntry: entry,
      ratePerHour: entry.ratePerHour,
      graceMinutes: entry.graceMinutes
    });

    const calculatedAmount = updatedEntry.calculatedAmount;

    // operator final amount & discount
    const resolvedFinalAmount = finalAmount !== undefined ? finalAmount : calculatedAmount;

    if (resolvedFinalAmount > calculatedAmount) {
      throw new Error('Final amount cannot exceed calculated amount');
    }

    const discountAmount = calculatedAmount - resolvedFinalAmount;

    updatedEntry.finalAmount = resolvedFinalAmount;
    updatedEntry.discountAmount = discountAmount;

    await updatedEntry.save({ session });

    // audit discount if applied
    if (discountAmount > 0) {
      await logAudit(
        {
          entity: 'ParkingEntry',
          entityId: updatedEntry._id,
          action: 'DISCOUNT_APPLIED',
          oldValue: { calculatedAmount },
          newValue: {
            finalAmount: resolvedFinalAmount,
            discountAmount
          },
          performedBy: req.user.userId
        },
        session
      );
    }

    // audit checkout
    await logAudit(
      {
        entity: 'ParkingEntry',
        entityId: updatedEntry._id,
        action: 'CHECK_OUT',
        oldValue: { status: PARKING_STATUS.IN },
        newValue: updatedEntry,
        performedBy: req.user.userId
      },
      session
    );

    await session.commitTransaction();
    res.json(updatedEntry);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
}