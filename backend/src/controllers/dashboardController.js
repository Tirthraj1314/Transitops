const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');

// @desc  Get dashboard KPIs (with optional filters)
// @route GET /api/dashboard?type=&status=&region=
const getDashboardKPIs = async (req, res) => {
  try {
    const { type, status, region } = req.query;

    const vehicleFilter = {};
    if (type) vehicleFilter.type = type;
    if (status) vehicleFilter.status = status;
    if (region) vehicleFilter.region = region;

    const totalVehicles = await Vehicle.countDocuments(vehicleFilter);
    const availableVehicles = await Vehicle.countDocuments({ ...vehicleFilter, status: 'Available' });
    const onTripVehicles = await Vehicle.countDocuments({ ...vehicleFilter, status: 'On Trip' });
    const inShopVehicles = await Vehicle.countDocuments({ ...vehicleFilter, status: 'In Shop' });
    const retiredVehicles = await Vehicle.countDocuments({ ...vehicleFilter, status: 'Retired' });

    // "Active Vehicles" = not retired (Available + On Trip + In Shop)
    const activeVehicles = totalVehicles - retiredVehicles;

    const activeTrips = await Trip.countDocuments({ status: 'Dispatched' });
    const pendingTrips = await Trip.countDocuments({ status: 'Draft' });

    const driversOnDuty = await Driver.countDocuments({ status: 'On Trip' });
    const totalDrivers = await Driver.countDocuments();

    // Fleet Utilization % = (Vehicles On Trip / Active Vehicles) * 100
    const fleetUtilization = activeVehicles > 0
      ? Number(((onTripVehicles / activeVehicles) * 100).toFixed(2))
      : 0;

    res.json({
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance: inShopVehicles,
      retiredVehicles,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      totalDrivers,
      fleetUtilization, // percentage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardKPIs };