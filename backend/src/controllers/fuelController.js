const FuelLog = require('../models/FuelLog');
const Vehicle = require('../models/Vehicle');
const { notifyRole } = require('../utils/notify');

// @desc  Add a fuel log entry
// @route POST /api/fuel
const createFuelLog = async (req, res) => {
  try {
    const { vehicle, liters, cost, date } = req.body;

    if (!vehicle || !liters || !cost) {
      return res.status(400).json({ message: 'Vehicle, liters, and cost are required' });
    }

    const vehicleDoc = await Vehicle.findById(vehicle);
    if (!vehicleDoc) return res.status(404).json({ message: 'Vehicle not found' });

    const fuelLog = await FuelLog.create({
      vehicle,
      liters,
      cost,
      date: date || Date.now(),
    });

    notifyRole('Super Admin', 'Fuel Added', `${liters}L fuel logged for ${vehicleDoc.registrationNumber} (₹${cost})`);

    res.status(201).json(fuelLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all fuel logs (optionally filter by vehicle)
// @route GET /api/fuel?vehicle=
const getFuelLogs = async (req, res) => {
  try {
    const { vehicle } = req.query;
    const filter = {};
    if (vehicle) filter.vehicle = vehicle;

    const logs = await FuelLog.find(filter)
      .populate('vehicle', 'registrationNumber name')
      .sort({ date: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a fuel log
// @route DELETE /api/fuel/:id
const deleteFuelLog = async (req, res) => {
  try {
    const log = await FuelLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Fuel log not found' });
    await log.deleteOne();
    res.json({ message: 'Fuel log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createFuelLog, getFuelLogs, deleteFuelLog };