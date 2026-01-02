const Vehicle = require('../models/Vehicle');

// Get vehicle by number
exports.getByNumber = async (req, res) => {
  try {
    const { vehicleNumber } = req.params;
    
    if (!vehicleNumber) {
      return res.status(400).json({ error: 'Vehicle number required' });
    }

    const normalizedVehicleNumber = vehicleNumber.trim().toUpperCase();
    const vehicle = await Vehicle.findOne({ vehicleNumber: normalizedVehicleNumber });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all vehicles
exports.getAll = async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    console.error('Get all vehicles error:', error);
    res.status(500).json({ error: error.message });
  }
};

