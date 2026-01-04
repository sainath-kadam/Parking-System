import mongoose from 'mongoose';

import Vehicle from '../models/Vehicle.js';
import ParkingEntry from '../models/ParkingEntry.js';

import { PARKING_STATUS } from '../utils/constants.js';

import { upsertDriver } from '../services/driver.service.js';
import { closeAssignment, createAssignment } from '../services/assignment.service.js';

import { checkOutParkingEntry } from '../services/parking.service.js';
import { logAudit } from '../services/audit.service.js';

export async function checkOutVehicle(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { vehicleNumber, driver, finalAmount } = req.body;
    const tenantId = req.tenantId;

    const vehicle = await Vehicle.findOne({ vehicleNumber, tenantId }).session(session);
    if (!vehicle) throw new Error('Vehicle not found');

    const entry = await ParkingEntry.findOne({
      tenantId,
      vehicleId: vehicle._id,
      status: PARKING_STATUS.IN
    })
      .populate('assignmentId')
      .session(session);

    if (!entry) throw new Error('Vehicle is not currently parked');

    const assignment = entry.assignmentId;

    if (driver) {
      const updatedDriver = await upsertDriver(
        { ...driver, tenantId },
        session
      );

      if (updatedDriver._id.toString() !== assignment.driverId.toString()) {
        await closeAssignment(
          { assignment, tenantId },
          session
        );

        const newAssignment = await createAssignment(
          {
            tenantId,
            vehicleId: assignment.vehicleId,
            ownerId: assignment.ownerId,
            driverId: updatedDriver._id
          },
          session
        );

        entry.assignmentId = newAssignment._id;

        await logAudit(
          {
            tenantId,
            entity: 'VehicleAssignment',
            entityId: newAssignment._id,
            action: 'DRIVER_REASSIGNED_AT_CHECKOUT',
            performedBy: req.user.userId
          },
          session
        );
      }
    }

    const updatedEntry = await checkOutParkingEntry({
      parkingEntry: entry,
      ratePerHour: entry.ratePerHour,
      graceMinutes: entry.graceMinutes
    });

    const calculatedAmount = updatedEntry.calculatedAmount;
    const resolvedFinalAmount = finalAmount !== undefined ? finalAmount : calculatedAmount;

    if (resolvedFinalAmount > calculatedAmount) throw new Error('Final amount cannot exceed calculated amount');

    const discountAmount = calculatedAmount - resolvedFinalAmount;

    updatedEntry.finalAmount = resolvedFinalAmount;
    updatedEntry.discountAmount = discountAmount;

    await updatedEntry.save({ session });

    if (discountAmount > 0) {
      await logAudit(
        {
          tenantId,
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

    await logAudit(
      {
        tenantId,
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