const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    category: { type: String, required: true }, // e.g. "Toll", "Fine", "Parking"
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);