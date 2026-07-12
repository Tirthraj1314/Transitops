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
  .post(authorizeRoles('Fleet Manager'), createDriver)
  .get(getDrivers);

router.route('/:id')
  .get(getDriverById)
  .put(authorizeRoles('Fleet Manager'), updateDriver)
  .delete(authorizeRoles('Fleet Manager'), deleteDriver);

router.patch('/:id/safety', authorizeRoles('Safety Officer'), updateDriverSafety);

module.exports = router;