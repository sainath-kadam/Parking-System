import ParkingEntry from '../models/ParkingEntry.js';
import { getISTNow, diffMinutes } from '../utils/istTime.js';
import { PARKING_STATUS } from '../utils/constants.js';
import { calculateAmount } from './pricing.service.js';

export async function checkOutParkingEntry({
  parkingEntry,
  ratePerHour,
  graceMinutes
}) {
  const outTime = getISTNow();
  const durationMinutes = diffMinutes(parkingEntry.inTime, outTime);

  const amount = calculateAmount({
    ratePerHour,
    durationMinutes,
    graceMinutes
  });

  parkingEntry.outTime = outTime;
  parkingEntry.durationMinutes = durationMinutes;
  parkingEntry.calculatedAmount = amount;
  parkingEntry.status = PARKING_STATUS.OUT;

  await parkingEntry.save();

  return parkingEntry;
}
