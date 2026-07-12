const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');

// @desc  Create a maintenance record — auto sets vehicle to "In Shop"
// @route POST /api/maintenance
const createMaintenance = async (req, res) => {
  try {
    const { vehicle, type, description, cost, date } = req.body;

    if (!vehicle || !type) {
      return res.status(400).json({ message: 'Vehicle and maintenance type are required' });
    }

    const vehicleDoc = await Vehicle.findById(vehicle);
    if (!vehicleDoc) return res.status(404).json({ message: 'Vehicle not found' });

    // Rule: a vehicle currently On Trip shouldn't be pulled into maintenance directly
    if (vehicleDoc.status === 'On Trip') {
      return res.status(400).json({ message: 'Cannot start maintenance on a vehicle that is currently On Trip' });
    }

    const maintenance = await Maintenance.create({
      vehicle,
      type,
      description,
      cost: cost || 0,
      date: date || Date.now(),
      status: 'Active',
    });

    // Auto status transition
    vehicleDoc.status = 'In Shop';
    await vehicleDoc.save();

    res.status(201).json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all maintenance records (optionally filter by vehicle/status)
// @route GET /api/maintenance?vehicle=&status=
const getMaintenanceRecords = async (req, res) => {
  try {
    const { vehicle, status } = req.query;
    const filter = {};
    if (vehicle) filter.vehicle = vehicle;
    if (status) filter.status = status;

    const records = await Maintenance.find(filter)
      .populate('vehicle', 'registrationNumber name status')
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single maintenance record
// @route GET /api/maintenance/:id
const getMaintenanceById = async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id).populate('vehicle');
    if (!record) return res.status(404).json({ message: 'Maintenance record not found' });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Close a maintenance record — restores vehicle to Available (unless Retired)
// @route PATCH /api/maintenance/:id/close
const closeMaintenance = async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Maintenance record not found' });

    if (record.status === 'Closed') {
      return res.status(400).json({ message: 'Maintenance record is already closed' });
    }

    record.status = 'Closed';
    await record.save();

    const vehicleDoc = await Vehicle.findById(record.vehicle);
    if (vehicleDoc && vehicleDoc.status !== 'Retired') {
      // Only restore to Available if there's no OTHER active maintenance on this vehicle
      const otherActive = await Maintenance.findOne({
        vehicle: vehicleDoc._id,
        status: 'Active',
        _id: { $ne: record._id },
      });

      if (!otherActive) {
        vehicleDoc.status = 'Available';
        await vehicleDoc.save();
      }
    }

    res.json({ message: 'Maintenance closed successfully', record, vehicle: vehicleDoc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update maintenance record (cost, description, type)
// @route PUT /api/maintenance/:id
const updateMaintenance = async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Maintenance record not found' });

    const { type, description, cost, date } = req.body;
    if (type !== undefined) record.type = type;
    if (description !== undefined) record.description = description;
    if (cost !== undefined) record.cost = cost;
    if (date !== undefined) record.date = date;

    await record.save();
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMaintenance,
  getMaintenanceRecords,
  getMaintenanceById,
  closeMaintenance,
  updateMaintenance,
};