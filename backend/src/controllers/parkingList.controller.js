import ParkingEntry from '../models/ParkingEntry.js';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import Owner from '../models/Owner.js';

export async function getParkingList(req, res) {
  try {
    const {
      filter = 'all',
      from,
      to,
      vehicleNumber,
      driverMobile,
      ownerMobile,
      page = 1
    } = req.query;

    const tenantId = req.tenantId;
    const limit = 30;
    const skip = (Number(page) - 1) * limit;

    const query = { tenantId };
    const now = new Date();
    let startDate;
    let endDate = now;

    if (filter === 'today') startDate = new Date(new Date().setHours(0, 0, 0, 0));
    if (filter === 'week') startDate = new Date(new Date().setDate(new Date().getDate() - new Date().getDay()));
    if (filter === 'month') startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    if (filter === 'custom') {
      if (!from || !to) return res.status(400).json({ message: 'from and to are required for custom filter' });
      startDate = new Date(from);
      endDate = new Date(to);
    }

    if (startDate) query.inTime = { $gte: startDate, $lte: endDate };

    if (vehicleNumber) {
      const vehicle = await Vehicle.findOne({ tenantId, vehicleNumber });
      if (!vehicle) return res.json({ data: [], pagination: { page: Number(page), limit, total: 0, hasMore: false } });
      query.vehicleId = vehicle._id;
    }

    if (driverMobile || ownerMobile) {
      const assignmentMatch = { tenantId };

      if (driverMobile) {
        const driver = await Driver.findOne({ tenantId, mobile: driverMobile });
        if (!driver) return res.json({ data: [], pagination: { page: Number(page), limit, total: 0, hasMore: false } });
        assignmentMatch.driverId = driver._id;
      }

      if (ownerMobile) {
        const owner = await Owner.findOne({ tenantId, mobile: ownerMobile });
        if (!owner) return res.json({ data: [], pagination: { page: Number(page), limit, total: 0, hasMore: false } });
        assignmentMatch.ownerId = owner._id;
      }

      const assignmentIds = await ParkingEntry.distinct(
        'assignmentId',
        assignmentMatch
      );

      query.assignmentId = { $in: assignmentIds };
    }

    const data = await ParkingEntry.find(query)
      .populate('vehicleId')
      .populate('assignmentId')
      .sort({ inTime: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ParkingEntry.countDocuments(query);

    res.json({
      data,
      pagination: {
        page: Number(page),
        limit,
        total,
        hasMore: skip + data.length < total
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch parking records' });
  }
}