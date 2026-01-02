const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    index: true
  },
  ownerName: {
    type: String,
    required: true,
    trim: true
  },
  ownerMobile: {
    type: String,
    required: true,
    trim: true
  },
  driverName: {
    type: String,
    trim: true,
    default: ''
  },
  driverMobile: {
    type: String,
    trim: true,
    default: ''
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['Bike', 'Car', 'SUV', 'Truck', 'Other'],
    default: 'Car'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);

