const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Invoice = require('../models/Invoice');
const { notifyRole, notifyUser } = require('../utils/notify');

// @desc  Create a trip (Draft status) — does NOT lock vehicle/driver yet
// @route POST /api/trips
const createTrip = async (req, res) => {
  try {
    const { source, destination, vehicle, driver, cargoWeight, plannedDistance } = req.body;

    if (!source || !destination || !vehicle || !driver || !cargoWeight || !plannedDistance) {
      return res.status(400).json({ message: 'Missing required trip fields' });
    }

    const vehicleDoc = await Vehicle.findById(vehicle);
    if (!vehicleDoc) return res.status(404).json({ message: 'Vehicle not found' });

    const driverDoc = await Driver.findById(driver);
    if (!driverDoc) return res.status(404).json({ message: 'Driver not found' });

    // Cargo weight check happens at creation time already, since it's static
    if (cargoWeight > vehicleDoc.maxLoadCapacity) {
      return res.status(400).json({
        message: `Cargo weight (${cargoWeight}kg) exceeds vehicle max load capacity (${vehicleDoc.maxLoadCapacity}kg)`,
      });
    }

    const trip = await Trip.create({
      source,
      destination,
      vehicle,
      driver,
      cargoWeight,
      plannedDistance,
      status: 'Draft',
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all trips (optionally filter by status)
// @route GET /api/trips?status=
const getTrips = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const trips = await Trip.find(filter)
      .populate('vehicle', 'registrationNumber name type status')
      .populate('driver', 'name licenseNumber status')
      .sort({ createdAt: -1 });

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single trip
// @route GET /api/trips/:id
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('vehicle')
      .populate('driver');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Dispatch a trip — validates everything, locks vehicle & driver
// @route PATCH /api/trips/:id/dispatch
const dispatchTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.status !== 'Draft') {
      return res.status(400).json({ message: `Cannot dispatch a trip with status ${trip.status}` });
    }

    const vehicleDoc = await Vehicle.findById(trip.vehicle);
    const driverDoc = await Driver.findById(trip.driver);

    if (!vehicleDoc || !driverDoc) {
      return res.status(404).json({ message: 'Vehicle or driver no longer exists' });
    }

    // Rule: Retired or In Shop vehicles cannot be dispatched
    if (['Retired', 'In Shop'].includes(vehicleDoc.status)) {
      return res.status(400).json({ message: `Vehicle is ${vehicleDoc.status} and cannot be dispatched` });
    }

    // Rule: vehicle already On Trip cannot be assigned again
    if (vehicleDoc.status === 'On Trip') {
      return res.status(400).json({ message: 'Vehicle is already assigned to another trip' });
    }

    // Rule: expired license or suspended driver cannot be assigned
    if (driverDoc.status === 'Suspended') {
      return res.status(400).json({ message: 'Driver is suspended and cannot be dispatched' });
    }
    if (new Date(driverDoc.licenseExpiryDate) < new Date()) {
      return res.status(400).json({ message: 'Driver license has expired' });
    }

    // Rule: driver already On Trip cannot be assigned again
    if (driverDoc.status === 'On Trip') {
      return res.status(400).json({ message: 'Driver is already assigned to another trip' });
    }

    // Rule: cargo weight re-check (in case vehicle changed since trip creation)
    if (trip.cargoWeight > vehicleDoc.maxLoadCapacity) {
      return res.status(400).json({
        message: `Cargo weight (${trip.cargoWeight}kg) exceeds vehicle max load capacity (${vehicleDoc.maxLoadCapacity}kg)`,
      });
    }

    // All checks passed — dispatch
    trip.status = 'Dispatched';
    vehicleDoc.status = 'On Trip';
    driverDoc.status = 'On Trip';

    await trip.save();
    await vehicleDoc.save();
    await driverDoc.save();

    if (driverDoc.user) {
      notifyUser(driverDoc.user, 'Trip Started', `You've been dispatched: ${trip.source} → ${trip.destination}`);
    }

    res.json({ message: 'Trip dispatched successfully', trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetches the Driver record linked to a Driver-role user, and confirms it
// owns the given trip. Returns the Driver doc, or sends a 403/404 and
// returns null.
const requireOwnTrip = async (req, res, trip) => {
  if (req.user.role !== 'Driver') return true;

  const driverDoc = await Driver.findOne({ user: req.user._id });
  if (!driverDoc) {
    res.status(404).json({ message: 'No driver profile is linked to this account' });
    return null;
  }
  if (!trip.driver.equals(driverDoc._id)) {
    res.status(403).json({ message: 'This trip is not assigned to you' });
    return null;
  }
  return driverDoc;
};

// @desc  Get trips assigned to the logged-in driver
// @route GET /api/trips/my
const getMyTrips = async (req, res) => {
  try {
    const driverDoc = await Driver.findOne({ user: req.user._id });
    if (!driverDoc) {
      return res.status(404).json({ message: 'No driver profile is linked to this account' });
    }

    const trips = await Trip.find({ driver: driverDoc._id })
      .populate('vehicle', 'registrationNumber name type status')
      .populate('driver', 'name licenseNumber status safetyScore')
      .sort({ createdAt: -1 });

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Driver accepts a dispatched trip and starts it
// @route PATCH /api/trips/:id/start
const startTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.status !== 'Dispatched') {
      return res.status(400).json({ message: `Cannot start a trip with status ${trip.status}` });
    }

    const ownershipOk = await requireOwnTrip(req, res, trip);
    if (!ownershipOk) return;

    trip.status = 'In Progress';
    await trip.save();
    res.json({ message: 'Trip started', trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Driver rejects an assigned trip before starting it (same effect as cancel)
// @route PATCH /api/trips/:id/reject
const rejectTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.status !== 'Dispatched') {
      return res.status(400).json({ message: `Cannot reject a trip with status ${trip.status}` });
    }

    const ownershipOk = await requireOwnTrip(req, res, trip);
    if (!ownershipOk) return;

    trip.status = 'Cancelled';
    await trip.save();

    const vehicleDoc = await Vehicle.findById(trip.vehicle);
    const driverDoc = await Driver.findById(trip.driver);
    if (vehicleDoc) {
      vehicleDoc.status = 'Available';
      await vehicleDoc.save();
    }
    if (driverDoc) {
      driverDoc.status = 'Available';
      await driverDoc.save();
    }

    res.json({ message: 'Trip rejected', trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Driver reports a breakdown or accident on an in-progress trip
// @route PATCH /api/trips/:id/report-issue
const reportIssue = async (req, res) => {
  try {
    const { type, description } = req.body;
    if (!['Breakdown', 'Accident'].includes(type)) {
      return res.status(400).json({ message: 'type must be "Breakdown" or "Accident"' });
    }

    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const ownershipOk = await requireOwnTrip(req, res, trip);
    if (!ownershipOk) return;

    trip.issueReport = { type, description, reportedAt: new Date() };
    await trip.save();

    notifyRole(
      ['Super Admin', 'Fleet Manager'],
      'Vehicle Breakdown',
      `${type} reported on trip ${trip.source} → ${trip.destination}: ${description}`
    );

    res.json({ message: `${type} reported`, trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Complete a trip — restores vehicle & driver to Available
// @route PATCH /api/trips/:id/complete
const completeTrip = async (req, res) => {
  try {
    const { finalOdometer, fuelConsumed, revenue, proofNotes } = req.body;
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (!['Dispatched', 'In Progress'].includes(trip.status)) {
      return res.status(400).json({ message: `Cannot complete a trip with status ${trip.status}` });
    }

    const ownershipOk = await requireOwnTrip(req, res, trip);
    if (!ownershipOk) return;

    const vehicleDoc = await Vehicle.findById(trip.vehicle);
    const driverDoc = await Driver.findById(trip.driver);

    trip.status = 'Completed';
    if (finalOdometer !== undefined) trip.finalOdometer = finalOdometer;
    if (fuelConsumed !== undefined) trip.fuelConsumed = fuelConsumed;
    if (revenue !== undefined) trip.revenue = revenue;
    if (proofNotes !== undefined) trip.proofNotes = proofNotes;

    if (vehicleDoc) {
      if (finalOdometer !== undefined) vehicleDoc.odometer = finalOdometer;
      vehicleDoc.status = 'Available';
      await vehicleDoc.save();
    }
    if (driverDoc) {
      driverDoc.status = 'Available';
      await driverDoc.save();
    }

    await trip.save();

    // Auto-generate an invoice for completed trips with revenue attached
    if (trip.revenue > 0) {
      const existing = await Invoice.findOne({ trip: trip._id });
      if (!existing) {
        const invoiceNumber = `INV-${trip._id.toString().slice(-6).toUpperCase()}`;
        await Invoice.create({
          invoiceNumber,
          trip: trip._id,
          vehicle: trip.vehicle,
          amount: trip.revenue,
        });
      }
    }

    notifyRole(
      ['Super Admin', 'Dispatcher'],
      'Trip Completed',
      `Trip ${trip.source} → ${trip.destination} was completed`
    );

    res.json({ message: 'Trip completed successfully', trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Cancel a trip — if it was Dispatched, restores vehicle & driver
// @route PATCH /api/trips/:id/cancel
const cancelTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (['Completed', 'Cancelled'].includes(trip.status)) {
      return res.status(400).json({ message: `Cannot cancel a trip with status ${trip.status}` });
    }

    const wasLocked = ['Dispatched', 'In Progress'].includes(trip.status);
    trip.status = 'Cancelled';
    await trip.save();

    if (wasLocked) {
      const vehicleDoc = await Vehicle.findById(trip.vehicle);
      const driverDoc = await Driver.findById(trip.driver);

      if (vehicleDoc) {
        vehicleDoc.status = 'Available';
        await vehicleDoc.save();
      }
      if (driverDoc) {
        driverDoc.status = 'Available';
        await driverDoc.save();
      }
    }

    res.json({ message: 'Trip cancelled successfully', trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  getMyTrips,
  dispatchTrip,
  startTrip,
  rejectTrip,
  reportIssue,
  completeTrip,
  cancelTrip,
};