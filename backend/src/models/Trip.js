const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },
    destination: { type: String, required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    cargoWeight: { type: Number, required: true }, // kg
    plannedDistance: { type: Number, required: true }, // km
    finalOdometer: { type: Number }, // filled on completion
    fuelConsumed: { type: Number }, // liters, filled on completion
    status: {
      type: String,
      enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'],
      default: 'Draft',
    },
    revenue: { type: Number, default: 0 }, // used later for ROI calc in reports
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);