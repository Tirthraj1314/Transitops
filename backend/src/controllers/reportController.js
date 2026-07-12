const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const FuelLog = require('../models/FuelLog');
const Maintenance = require('../models/Maintenance');
const Expense = require('../models/Expense');
const { Parser } = require('json2csv');

// Builds a full per-vehicle analytics report (reused by both JSON and CSV endpoints)
const buildVehicleReport = async () => {
  const vehicles = await Vehicle.find();
  const report = [];

  for (const vehicle of vehicles) {
    const trips = await Trip.find({ vehicle: vehicle._id, status: 'Completed' });
    const fuelLogs = await FuelLog.find({ vehicle: vehicle._id });
    const maintenanceRecords = await Maintenance.find({ vehicle: vehicle._id });
    const expenses = await Expense.find({ vehicle: vehicle._id });

    const totalDistance = trips.reduce((sum, t) => sum + (t.plannedDistance || 0), 0);
    const totalFuelConsumed = trips.reduce((sum, t) => sum + (t.fuelConsumed || 0), 0);
    const totalRevenue = trips.reduce((sum, t) => sum + (t.revenue || 0), 0);

    const totalFuelCost = fuelLogs.reduce((sum, f) => sum + f.cost, 0);
    const totalMaintenanceCost = maintenanceRecords.reduce((sum, m) => sum + m.cost, 0);
    const totalExpenseCost = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalOperationalCost = totalFuelCost + totalMaintenanceCost + totalExpenseCost;

    // Fuel Efficiency = Distance / Fuel (km per liter)
    const fuelEfficiency = totalFuelConsumed > 0
      ? Number((totalDistance / totalFuelConsumed).toFixed(2))
      : 0;

    // Vehicle ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost
    const roi = vehicle.acquisitionCost > 0
      ? Number((((totalRevenue - (totalMaintenanceCost + totalFuelCost)) / vehicle.acquisitionCost) * 100).toFixed(2))
      : 0;

    report.push({
      registrationNumber: vehicle.registrationNumber,
      name: vehicle.name,
      type: vehicle.type,
      status: vehicle.status,
      totalTripsCompleted: trips.length,
      totalDistanceKm: totalDistance,
      totalFuelConsumedLiters: totalFuelConsumed,
      fuelEfficiencyKmPerLiter: fuelEfficiency,
      totalFuelCost,
      totalMaintenanceCost,
      totalExpenseCost,
      totalOperationalCost,
      totalRevenue,
      roiPercentage: roi,
    });
  }

  return report;
};

// @desc  Get full analytics report (JSON)
// @route GET /api/reports
const getReport = async (req, res) => {
  try {
    const report = await buildVehicleReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Export analytics report as CSV
// @route GET /api/reports/export/csv
const exportReportCSV = async (req, res) => {
  try {
    const report = await buildVehicleReport();

    if (report.length === 0) {
      return res.status(404).json({ message: 'No data available to export' });
    }

    const parser = new Parser();
    const csv = parser.parse(report);

    res.header('Content-Type', 'text/csv');
    res.attachment('transitops_report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReport, exportReportCSV };