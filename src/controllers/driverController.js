const Driver = require('../models/Driver');

// @desc  Create a new driver
// @route POST /api/drivers
const createDriver = async (req, res) => {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber } = req.body;

    if (!name || !licenseNumber || !licenseCategory || !licenseExpiryDate || !contactNumber) {
      return res.status(400).json({ message: 'Missing required driver fields' });
    }

    const existing = await Driver.findOne({ licenseNumber });
    if (existing) {
      return res.status(400).json({ message: 'Driver with this license number already exists' });
    }

    const driver = await Driver.create({
      name,
      licenseNumber,
      licenseCategory,
      licenseExpiryDate,
      contactNumber,
    });

    res.status(201).json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all drivers (with optional filters)
// @route GET /api/drivers?status=
const getDrivers = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const drivers = await Driver.find(filter).sort({ createdAt: -1 });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single driver by ID
// @route GET /api/drivers/:id
const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update driver (general info)
// @route PUT /api/drivers/:id
const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    if (req.body.licenseNumber && req.body.licenseNumber !== driver.licenseNumber) {
      const existing = await Driver.findOne({ licenseNumber: req.body.licenseNumber });
      if (existing) {
        return res.status(400).json({ message: 'Another driver already uses this license number' });
      }
    }

    Object.assign(driver, req.body);
    await driver.save();
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update safety score / suspend / reinstate driver (Safety Officer action)
// @route PATCH /api/drivers/:id/safety
const updateDriverSafety = async (req, res) => {
  try {
    const { safetyScore, status } = req.body;
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    if (driver.status === 'On Trip' && status && status !== 'On Trip') {
      return res.status(400).json({ message: 'Cannot change status of a driver currently on trip' });
    }

    if (safetyScore !== undefined) driver.safetyScore = safetyScore;
    if (status && ['Available', 'Off Duty', 'Suspended'].includes(status)) {
      driver.status = status;
    }

    await driver.save();
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete driver
// @route DELETE /api/drivers/:id
const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    await driver.deleteOne();
    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  updateDriverSafety,
  deleteDriver,
};