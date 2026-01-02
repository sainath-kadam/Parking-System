const mongoose = require('mongoose');

const parkingEntrySchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  vehicleNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    index: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkInTime: {
    type: String,
    required: true
  },
  checkOutDate: {
    type: Date,
    default: null
  },
  checkOutTime: {
    type: String,
    default: ''
  },
  ratePerDay: {
    type: Number,
    required: true,
    min: 0
  },
  totalDays: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['IN', 'OUT'],
    default: 'IN',
    index: true
  }
}, {
  timestamps: true
});

// Index for active parking queries
parkingEntrySchema.index({ status: 1, vehicleNumber: 1 });

module.exports = mongoose.model('ParkingEntry', parkingEntrySchema);

