require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./src/config/db');

const User = require('./src/models/User');
const Vehicle = require('./src/models/Vehicle');
const Driver = require('./src/models/Driver');
const Trip = require('./src/models/Trip');
const Maintenance = require('./src/models/Maintenance');
const FuelLog = require('./src/models/FuelLog');
const Expense = require('./src/models/Expense');

const seed = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany(),
      Vehicle.deleteMany(),
      Driver.deleteMany(),
      Trip.deleteMany(),
      Maintenance.deleteMany(),
      FuelLog.deleteMany(),
      Expense.deleteMany(),
    ]);

    console.log('Creating users (one per role)...');
    const password = await bcrypt.hash('password123', 10);

    const users = await User.create([
      { name: 'Manish (Fleet Manager)', email: 'fleetmanager@transitops.com', password, role: 'FleetManager' },
      { name: 'Alex (Driver)', email: 'driver@transitops.com', password, role: 'Driver' },
      { name: 'Priya (Safety Officer)', email: 'safety@transitops.com', password, role: 'SafetyOfficer' },
      { name: 'Rahul (Financial Analyst)', email: 'finance@transitops.com', password, role: 'FinancialAnalyst' },
    ]);
    console.log(`Created ${users.length} users. Password for all: password123`);

    console.log('Creating vehicles...');
    const vehicles = await Vehicle.create([
      {
        registrationNumber: 'GJ01AB1234',
        name: 'Van-05',
        type: 'Van',
        maxLoadCapacity: 500,
        odometer: 12500,
        acquisitionCost: 800000,
        status: 'Available',
        region: 'Ahmedabad',
      },
      {
        registrationNumber: 'GJ01CD5678',
        name: 'Truck-12',
        type: 'Truck',
        maxLoadCapacity: 2000,
        odometer: 45000,
        acquisitionCost: 1800000,
        status: 'Available',
        region: 'Ahmedabad',
      },
      {
        registrationNumber: 'GJ05EF9012',
        name: 'Van-08',
        type: 'Van',
        maxLoadCapacity: 600,
        odometer: 8000,
        acquisitionCost: 850000,
        status: 'Available',
        region: 'Surat',
      },
      {
        registrationNumber: 'GJ01GH3456',
        name: 'Truck-03',
        type: 'Truck',
        maxLoadCapacity: 1500,
        odometer: 62000,
        acquisitionCost: 1600000,
        status: 'Retired',
        region: 'Ahmedabad',
      },
    ]);
    console.log(`Created ${vehicles.length} vehicles.`);

    console.log('Creating drivers...');
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1); // 1 year from now

    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1); // expired 1 year ago

    const drivers = await Driver.create([
      {
        name: 'Alex Fernandes',
        licenseNumber: 'DL1000001',
        licenseCategory: 'LMV',
        licenseExpiryDate: futureDate,
        contactNumber: '9998887771',
        safetyScore: 95,
        status: 'Available',
      },
      {
        name: 'Ravi Patel',
        licenseNumber: 'DL1000002',
        licenseCategory: 'HMV',
        licenseExpiryDate: futureDate,
        contactNumber: '9998887772',
        safetyScore: 88,
        status: 'Available',
      },
      {
        name: 'Sanjay Mehta',
        licenseNumber: 'DL1000003',
        licenseCategory: 'LMV',
        licenseExpiryDate: pastDate, // EXPIRED — for testing rejection
        contactNumber: '9998887773',
        safetyScore: 70,
        status: 'Available',
      },
      {
        name: 'Vikram Singh',
        licenseNumber: 'DL1000004',
        licenseCategory: 'HMV',
        licenseExpiryDate: futureDate,
        contactNumber: '9998887774',
        safetyScore: 40,
        status: 'Suspended', // SUSPENDED — for testing rejection
      },
    ]);
    console.log(`Created ${drivers.length} drivers.`);

    console.log('Creating a completed trip (with revenue/fuel for ROI testing)...');
    const completedTrip = await Trip.create({
      source: 'Ahmedabad',
      destination: 'Vadodara',
      vehicle: vehicles[0]._id,
      driver: drivers[0]._id,
      cargoWeight: 450,
      plannedDistance: 110,
      finalOdometer: 12610,
      fuelConsumed: 12,
      status: 'Completed',
      revenue: 8000,
    });

    console.log('Creating a draft (pending) trip...');
    const draftTrip = await Trip.create({
      source: 'Ahmedabad',
      destination: 'Rajkot',
      vehicle: vehicles[1]._id,
      driver: drivers[1]._id,
      cargoWeight: 1200,
      plannedDistance: 220,
      status: 'Draft',
    });

    console.log('Creating fuel logs and expenses for the completed trip vehicle...');
    await FuelLog.create([
      { vehicle: vehicles[0]._id, liters: 12, cost: 1200, date: new Date() },
      { vehicle: vehicles[0]._id, liters: 8, cost: 800, date: new Date() },
    ]);

    await Expense.create([
      { vehicle: vehicles[0]._id, category: 'Toll', amount: 150, notes: 'Ahmedabad-Vadodara toll' },
      { vehicle: vehicles[0]._id, category: 'Parking', amount: 50 },
    ]);

    console.log('Creating an active maintenance record (vehicle 3 goes In Shop)...');
    await Maintenance.create({
      vehicle: vehicles[2]._id,
      type: 'Oil Change',
      description: 'Routine 5000km service',
      cost: 1500,
      status: 'Active',
    });
    vehicles[2].status = 'In Shop';
    await vehicles[2].save();

    console.log('\n=== SEED COMPLETE ===');
    console.log('\nLogin credentials (all use password: password123):');
    console.log('FleetManager   -> fleetmanager@transitops.com');
    console.log('Driver         -> driver@transitops.com');
    console.log('SafetyOfficer  -> safety@transitops.com');
    console.log('FinancialAnalyst -> finance@transitops.com');
    console.log('\nDemo scenarios ready:');
    console.log('- Van-05: Available, has a Completed trip with revenue/fuel/expenses (test Reports & ROI)');
    console.log('- Truck-12: Available, has a Draft trip ready to Dispatch (test dispatch flow)');
    console.log('- Van-08: In Shop (active maintenance) — try dispatching it, should be rejected');
    console.log('- Truck-03: Retired — try dispatching it, should be rejected');
    console.log('- Sanjay Mehta: expired license — try dispatching his trip, should be rejected');
    console.log('- Vikram Singh: Suspended — try dispatching his trip, should be rejected');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();