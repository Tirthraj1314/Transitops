const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: [
        'License Expiry',
        'Insurance Expiry',
        'Maintenance Due',
        'Trip Started',
        'Trip Completed',
        'Vehicle Breakdown',
        'Fuel Added',
        'Expense Added',
        'New User',
        'Password Changed',
      ],
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
