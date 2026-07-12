const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    licenseCategory: { type: String, required: true },
    licenseExpiryDate: { type: Date, required: true },
    contactNumber: { type: String, required: true },
    safetyScore: { type: Number, default: 100, min: 0, max: 100 },
    status: {
      type: String,
      enum: ['Available', 'On Trip', 'Off Duty', 'Suspended'],
      default: 'Available',
    },
    // Links this driver record to a Driver-role login account, if one exists.
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Driver', driverSchema);