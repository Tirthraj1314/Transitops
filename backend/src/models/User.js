const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // stored as bcrypt hash
    role: {
      type: String,
      enum: ['Super Admin', 'Fleet Manager', 'Dispatcher', 'Safety Officer', 'Finance Manager'],
      default: 'Dispatcher',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);