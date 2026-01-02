import ParkingEntry from '../models/ParkingEntry.js';

export async function getParkingList(req, res) {
  try {
    const list = await ParkingEntry.find()
      .populate('vehicleId')
      .populate('assignmentId')
      .sort({ inTime: -1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch parking list' });
  }
}