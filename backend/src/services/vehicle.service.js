import Vehicle from '../models/Vehicle.js';

export async function getOrCreateVehicle({ vehicleNumber, vehicleType }) {
  let vehicle = await Vehicle.findOne({ vehicleNumber });

  if (vehicle) return vehicle;

  return Vehicle.create({
    vehicleNumber,
    vehicleType
  });
}
