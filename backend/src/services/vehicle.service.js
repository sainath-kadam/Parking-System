import Vehicle from '../models/Vehicle.js';

export async function getOrCreateVehicle(
  { vehicleNumber, vehicleType },
  session
) {
  let vehicle = await Vehicle.findOne({ vehicleNumber }).session(session);
  if (vehicle) return vehicle;

  const [created] = await Vehicle.create(
    [{ vehicleNumber, vehicleType }],
    { session }
  );
  return created;
}