import ParkingEntry from '../models/ParkingEntry.js';

export async function getParkingDetails(req, res) {
  try {
    const { parkingEntryId } = req.params;

    const entry = await ParkingEntry.findById(parkingEntryId)
      .populate('vehicleId')
      .populate({
        path: 'assignmentId',
        populate: [
          { path: 'ownerId' },
          { path: 'driverId' }
        ]
      });

    if (!entry) return res.status(404).json({ message: 'Parking record not found' });

    res.json({
      parkingEntryId: entry._id,
      status: entry.status,

      vehicle: entry.vehicleId,

      owner: entry.assignmentId?.ownerId || null,
      driver: entry.assignmentId?.driverId || null,

      inTime: entry.inTime,
      outTime: entry.outTime,
      durationMinutes: entry.durationMinutes,

      ratePerHour: entry.ratePerHour,
      graceMinutes: entry.graceMinutes,

      calculatedAmount: entry.calculatedAmount,
      finalAmount: entry.finalAmount,
      discountAmount: entry.discountAmount
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch parking details' });
  }
}