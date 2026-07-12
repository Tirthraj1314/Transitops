const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true }, // Vehicle Name/Model
    type: { type: String, required: true }, // e.g. Truck, Van, Bike
    maxLoadCapacity: { type: Number, required: true }, // in kg
    odometer: { type: Number, default: 0 },
    acquisitionCost: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
      default: 'Available',
    },
    region: { type: String }, // used for dashboard filters
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);