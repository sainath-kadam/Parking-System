import ParkingEntry from '../models/ParkingEntry.js';
import { PARKING_STATUS } from '../utils/constants.js';

export async function getDashboardStats(req, res) {
  try {
    const tenantId = req.tenantId;

    const inCount = await ParkingEntry.countDocuments({
      tenantId,
      status: PARKING_STATUS.IN
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOut = await ParkingEntry.find({
      tenantId,
      status: PARKING_STATUS.OUT,
      outTime: { $gte: today }
    });

    const revenue = todayOut.reduce(
      (sum, e) => sum + (e.finalAmount ?? e.calculatedAmount ?? 0),
      0
    );

    res.json({
      activeVehicles: inCount,
      checkedOutToday: todayOut.length,
      todayRevenue: revenue
    });
  } catch (err) {
    res.status(500).json({ message: 'Dashboard failed' });
  }
}