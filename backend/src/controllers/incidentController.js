const Incident = require('../models/Incident');
const { logAudit } = require('../utils/audit');

// @desc  Report an incident
// @route POST /api/incidents
const createIncident = async (req, res) => {
  try {
    const { driver, vehicle, trip, type, severity, description, date } = req.body;

    if (!driver || !type || !description) {
      return res.status(400).json({ message: 'Driver, type, and description are required' });
    }

    const incident = await Incident.create({
      driver,
      vehicle,
      trip,
      type,
      severity,
      description,
      date: date || Date.now(),
      reportedBy: req.user._id,
    });

    logAudit(req, 'REPORT_INCIDENT', 'Incident', incident._id, `${type} - ${description}`);
    res.status(201).json(incident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all incidents (optionally filter by status/driver)
// @route GET /api/incidents?status=&driver=
const getIncidents = async (req, res) => {
  try {
    const { status, driver } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (driver) filter.driver = driver;

    const incidents = await Incident.find(filter)
      .populate('driver', 'name licenseNumber')
      .populate('vehicle', 'registrationNumber')
      .populate('reportedBy', 'name')
      .sort({ date: -1 });

    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Mark an incident as resolved
// @route PATCH /api/incidents/:id/resolve
const resolveIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ message: 'Incident not found' });

    incident.status = 'Resolved';
    await incident.save();
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createIncident, getIncidents, resolveIncident };
