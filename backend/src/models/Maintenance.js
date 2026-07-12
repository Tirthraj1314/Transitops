const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    type: { type: String, required: true }, // e.g. "Oil Change", "Tire Replacement"
    description: { type: String },
    cost: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['Active', 'Closed'],
      default: 'Active',
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);