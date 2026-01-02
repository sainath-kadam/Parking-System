import ParkingEntry from '../models/ParkingEntry.js';

export async function getParkingList(req, res) {
  try {
    const {
      filter = 'all',
      from,
      to,
      page = 1
    } = req.query;

    const limit = 30;
    const skip = (Number(page) - 1) * limit;

    const query = {};

    const now = new Date();
    let startDate;
    let endDate = now;

    if (filter === 'today') startDate = new Date(now.setHours(0, 0, 0, 0));
    if (filter === 'week') startDate = new Date(now.setDate(now.getDate() - now.getDay()));
    if (filter === 'month') startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    if (filter === 'custom') {
      if (!from || !to) return res.status(400).json({ message: 'from and to dates are required for custom filter' });
      startDate = new Date(from);
      endDate = new Date(to);
    }

    if (startDate) query.inTime = { $gte: startDate, $lte: endDate };

    const list = await ParkingEntry.find(query)
      .populate('vehicleId')
      .populate('assignmentId')
      .sort({ inTime: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ParkingEntry.countDocuments(query);

    res.json({
      data: list,
      pagination: {
        page: Number(page),
        limit,
        total,
        hasMore: skip + list.length < total
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch parking list' });
  }
}