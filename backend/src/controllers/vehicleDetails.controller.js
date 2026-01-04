import Vehicle from '../models/Vehicle.js';
import VehicleAssignment from '../models/VehicleAssignment.js';
import ParkingEntry from '../models/ParkingEntry.js';
import { PARKING_STATUS } from '../utils/constants.js';

export async function getVehicleDetails(req, res) {
  try {
    const { vehicleNumber } = req.params;
    const tenantId = req.tenantId;

    const vehicle = await Vehicle.findOne({ tenantId, vehicleNumber });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    const activeParking = await ParkingEntry.findOne({
      tenantId,
      vehicleId: vehicle._id,
      status: PARKING_STATUS.IN
    });

    if (activeParking) {
      return res.status(409).json({
        code: 'VEHICLE_ALREADY_PARKED',
        message: 'Vehicle already parked'
      });
    }

    const assignment = await VehicleAssignment.findOne({
      tenantId,
      vehicleId: vehicle._id,
      isActive: true
    })
      .populate('ownerId')
      .populate('driverId');

    res.json({
      vehicle,
      owner: assignment ? assignment.ownerId : null,
      driver: assignment ? assignment.driverId : null,
      parkingStatus: PARKING_STATUS.OUT
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch vehicle details' });
  }
}