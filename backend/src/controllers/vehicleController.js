const Vehicle = require('../models/Vehicle');
const FuelLog = require('../models/FuelLog');
const Maintenance = require('../models/Maintenance');
const Expense = require('../models/Expense');
const { logAudit } = require('../utils/audit');

// @desc  Create a new vehicle
// @route POST /api/vehicles
const createVehicle = async (req, res) => {
  try {
    const { registrationNumber, name, type, maxLoadCapacity, odometer, acquisitionCost, region } = req.body;

    if (!registrationNumber || !name || !type || !maxLoadCapacity || !acquisitionCost) {
      return res.status(400).json({ message: 'Missing required vehicle fields' });
    }

    const existing = await Vehicle.findOne({ registrationNumber });
    if (existing) {
      return res.status(400).json({ message: 'Vehicle with this registration number already exists' });
    }

    const vehicle = await Vehicle.create({
      registrationNumber,
      name,
      type,
      maxLoadCapacity,
      odometer: odometer || 0,
      acquisitionCost,
      region,
    });

    logAudit(req, 'CREATE_VEHICLE', 'Vehicle', vehicle._id, vehicle.registrationNumber);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all vehicles (with optional filters)
// @route GET /api/vehicles?type=&status=&region=
const getVehicles = async (req, res) => {
  try {
    const { type, status, region } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (region) filter.region = region;

    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single vehicle by ID
// @route GET /api/vehicles/:id
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update vehicle
// @route PUT /api/vehicles/:id
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    // Prevent changing registrationNumber to one that already exists on another vehicle
    if (req.body.registrationNumber && req.body.registrationNumber !== vehicle.registrationNumber) {
      const existing = await Vehicle.findOne({ registrationNumber: req.body.registrationNumber });
      if (existing) {
        return res.status(400).json({ message: 'Another vehicle already uses this registration number' });
      }
    }

    Object.assign(vehicle, req.body);
    await vehicle.save();
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete vehicle
// @route DELETE /api/vehicles/:id
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    await vehicle.deleteOne();
    logAudit(req, 'DELETE_VEHICLE', 'Vehicle', vehicle._id, vehicle.registrationNumber);
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get total operational cost breakdown for a vehicle
// @route GET /api/vehicles/:id/cost
const getVehicleOperationalCost = async (req, res) => {
  try {
    const vehicleId = req.params.id;

    const vehicleDoc = await Vehicle.findById(vehicleId);
    if (!vehicleDoc) return res.status(404).json({ message: 'Vehicle not found' });

    const fuelLogs = await FuelLog.find({ vehicle: vehicleId });
    const maintenanceRecords = await Maintenance.find({ vehicle: vehicleId });
    const expenses = await Expense.find({ vehicle: vehicleId });

    const totalFuelCost = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
    const totalMaintenanceCost = maintenanceRecords.reduce((sum, m) => sum + m.cost, 0);
    const totalExpenseCost = expenses.reduce((sum, e) => sum + e.amount, 0);

    const totalOperationalCost = totalFuelCost + totalMaintenanceCost + totalExpenseCost;

    res.json({
      vehicle: vehicleDoc.registrationNumber,
      totalFuelCost,
      totalMaintenanceCost,
      totalExpenseCost,
      totalOperationalCost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getVehicleOperationalCost,
};