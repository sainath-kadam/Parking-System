const ParkingEntry = require('../models/ParkingEntry');
const Vehicle = require('../models/Vehicle');

// Generate unique token ID
const generateTokenId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `TK${timestamp}${random}`;
};

// Calculate parking days
const calculateDays = (checkIn, checkOut) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Set to start of day for accurate calculation
  checkInDate.setHours(0, 0, 0, 0);
  checkOutDate.setHours(0, 0, 0, 0);
  
  const diffTime = checkOutDate - checkInDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Minimum 1 day (same day = 1 day)
  return Math.max(1, diffDays);
};

// Check-In
exports.checkIn = async (req, res) => {
  try {
    const {
      vehicleNumber,
      ownerName,
      ownerMobile,
      driverName,
      driverMobile,
      vehicleType,
      ratePerDay
    } = req.body;

    if (!vehicleNumber || !ownerName || !ownerMobile || !vehicleType || !ratePerDay) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Normalize vehicle number
    const normalizedVehicleNumber = vehicleNumber.trim().toUpperCase();

    // Check if vehicle exists, if not create it
    let vehicle = await Vehicle.findOne({ vehicleNumber: normalizedVehicleNumber });
    
    if (!vehicle) {
      vehicle = await Vehicle.create({
        vehicleNumber: normalizedVehicleNumber,
        ownerName,
        ownerMobile,
        driverName: driverName || '',
        driverMobile: driverMobile || '',
        vehicleType
      });
    } else {
      // Update vehicle details if provided
      if (ownerName) vehicle.ownerName = ownerName;
      if (ownerMobile) vehicle.ownerMobile = ownerMobile;
      if (driverName) vehicle.driverName = driverName;
      if (driverMobile) vehicle.driverMobile = driverMobile;
      if (vehicleType) vehicle.vehicleType = vehicleType;
      await vehicle.save();
    }

    // Check if vehicle is already parked
    const activeEntry = await ParkingEntry.findOne({
      vehicleNumber: normalizedVehicleNumber,
      status: 'IN'
    });

    if (activeEntry) {
      return res.status(400).json({ 
        error: 'Vehicle is already parked',
        activeEntry 
      });
    }

    // Create parking entry
    const now = new Date();
    const tokenId = generateTokenId();
    
    const parkingEntry = await ParkingEntry.create({
      tokenId,
      vehicleNumber: normalizedVehicleNumber,
      checkInDate: now,
      checkInTime: now.toLocaleTimeString('en-IN', { hour12: false }),
      ratePerDay: parseFloat(ratePerDay),
      status: 'IN'
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle checked in successfully',
      data: parkingEntry
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Check-Out
exports.checkOut = async (req, res) => {
  try {
    const { vehicleNumber, tokenId, checkOutDate, checkOutTime, ratePerDay } = req.body;

    if (!vehicleNumber && !tokenId) {
      return res.status(400).json({ error: 'Vehicle number or token ID required' });
    }

    // Find active parking entry
    const query = { status: 'IN' };
    if (tokenId) {
      query.tokenId = tokenId;
    } else {
      query.vehicleNumber = vehicleNumber.trim().toUpperCase();
    }

    const parkingEntry = await ParkingEntry.findOne(query);

    if (!parkingEntry) {
      return res.status(404).json({ error: 'No active parking entry found' });
    }

    // Calculate checkout
    const checkoutDate = checkOutDate ? new Date(checkOutDate) : new Date();
    const checkoutTime = checkOutTime || new Date().toLocaleTimeString('en-IN', { hour12: false });

    // Calculate days and amount
    const totalDays = calculateDays(parkingEntry.checkInDate, checkoutDate);
    const finalRate = ratePerDay ? parseFloat(ratePerDay) : parkingEntry.ratePerDay;
    const totalAmount = totalDays * finalRate;

    // Update parking entry
    parkingEntry.checkOutDate = checkoutDate;
    parkingEntry.checkOutTime = checkoutTime;
    parkingEntry.totalDays = totalDays;
    parkingEntry.ratePerDay = finalRate;
    parkingEntry.totalAmount = totalAmount;
    parkingEntry.status = 'OUT';

    await parkingEntry.save();

    // Get vehicle details
    const vehicle = await Vehicle.findOne({ vehicleNumber: parkingEntry.vehicleNumber });

    res.json({
      success: true,
      message: 'Vehicle checked out successfully',
      data: {
        ...parkingEntry.toObject(),
        vehicle: vehicle || null
      }
    });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get active parkings
exports.getActive = async (req, res) => {
  try {
    const activeParkings = await ParkingEntry.find({ status: 'IN' })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: activeParkings.length,
      data: activeParkings
    });
  } catch (error) {
    console.error('Get active error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get active entry by vehicle number or token
exports.getActiveEntry = async (req, res) => {
  try {
    const { vehicleNumber, tokenId } = req.query;

    if (!vehicleNumber && !tokenId) {
      return res.status(400).json({ error: 'Vehicle number or token ID required' });
    }

    const query = { status: 'IN' };
    if (tokenId) {
      query.tokenId = tokenId;
    } else {
      query.vehicleNumber = vehicleNumber.trim().toUpperCase();
    }

    const parkingEntry = await ParkingEntry.findOne(query);

    if (!parkingEntry) {
      return res.status(404).json({ error: 'No active parking entry found' });
    }

    // Get vehicle details
    const vehicle = await Vehicle.findOne({ vehicleNumber: parkingEntry.vehicleNumber });

    res.json({
      success: true,
      data: {
        ...parkingEntry.toObject(),
        vehicle: vehicle || null
      }
    });
  } catch (error) {
    console.error('Get active entry error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get parking history
exports.getHistory = async (req, res) => {
  try {
    const { from, to, limit = 100 } = req.query;
    
    const query = { status: 'OUT' };
    
    if (from || to) {
      query.checkOutDate = {};
      if (from) query.checkOutDate.$gte = new Date(from);
      if (to) query.checkOutDate.$lte = new Date(to);
    }

    const history = await ParkingEntry.find(query)
      .sort({ checkOutDate: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get dashboard stats
exports.getStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's entries
    const todayEntries = await ParkingEntry.countDocuments({
      checkInDate: { $gte: today, $lt: tomorrow }
    });

    // Currently parked
    const currentlyParked = await ParkingEntry.countDocuments({ status: 'IN' });

    // Today's earnings
    const todayEarnings = await ParkingEntry.aggregate([
      {
        $match: {
          status: 'OUT',
          checkOutDate: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Monthly earnings (current month)
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEarnings = await ParkingEntry.aggregate([
      {
        $match: {
          status: 'OUT',
          checkOutDate: { $gte: monthStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        todayEntries,
        currentlyParked,
        todayEarnings: todayEarnings[0]?.total || 0,
        monthEarnings: monthEarnings[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get parking by token ID
exports.getByToken = async (req, res) => {
  try {
    const { tokenId } = req.params;
    
    const parkingEntry = await ParkingEntry.findOne({ tokenId });
    
    if (!parkingEntry) {
      return res.status(404).json({ error: 'Parking entry not found' });
    }

    // Get vehicle details
    const vehicle = await Vehicle.findOne({ vehicleNumber: parkingEntry.vehicleNumber });

    res.json({
      success: true,
      data: {
        ...parkingEntry.toObject(),
        vehicle: vehicle || null
      }
    });
  } catch (error) {
    console.error('Get by token error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Cleanup old data (6 months retention)
exports.cleanup = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = await ParkingEntry.deleteMany({
      status: 'OUT',
      checkOutDate: { $lt: sixMonthsAgo }
    });

    res.json({
      success: true,
      message: `Cleaned up ${result.deletedCount} old records`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ error: error.message });
  }
};

