const Expense = require('../models/Expense');
const Vehicle = require('../models/Vehicle');
const { notifyRole } = require('../utils/notify');

// @desc  Add an expense entry (toll, fine, parking, etc.)
// @route POST /api/expenses
const createExpense = async (req, res) => {
  try {
    const { vehicle, category, amount, date, notes } = req.body;

    if (!vehicle || !category || !amount) {
      return res.status(400).json({ message: 'Vehicle, category, and amount are required' });
    }

    const vehicleDoc = await Vehicle.findById(vehicle);
    if (!vehicleDoc) return res.status(404).json({ message: 'Vehicle not found' });

    const expense = await Expense.create({
      vehicle,
      category,
      amount,
      date: date || Date.now(),
      notes,
    });

    notifyRole('Super Admin', 'Expense Added', `${category} expense of ₹${amount} added for ${vehicleDoc.registrationNumber}`);

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all expenses (optionally filter by vehicle/category)
// @route GET /api/expenses?vehicle=&category=
const getExpenses = async (req, res) => {
  try {
    const { vehicle, category } = req.query;
    const filter = {};
    if (vehicle) filter.vehicle = vehicle;
    if (category) filter.category = category;

    const expenses = await Expense.find(filter)
      .populate('vehicle', 'registrationNumber name')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete an expense
// @route DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    await expense.deleteOne();
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createExpense, getExpenses, deleteExpense };