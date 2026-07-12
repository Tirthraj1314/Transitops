const express = require('express');
const router = express.Router();
const {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  updateDriverSafety,
  deleteDriver,
} = require('../controllers/driverController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .post(authorizeRoles('FleetManager'), createDriver)
  .get(getDrivers);

router.route('/:id')
  .get(getDriverById)
  .put(authorizeRoles('FleetManager'), updateDriver)
  .delete(authorizeRoles('FleetManager'), deleteDriver);

router.patch('/:id/safety', authorizeRoles('SafetyOfficer'), updateDriverSafety);

module.exports = router;