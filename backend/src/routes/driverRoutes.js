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
  .post(authorizeRoles('Safety Officer'), createDriver)
  .get(getDrivers);

router.route('/:id')
  .get(getDriverById)
  .put(authorizeRoles('Safety Officer'), updateDriver)
  .delete(authorizeRoles('Safety Officer'), deleteDriver);

router.patch('/:id/safety', authorizeRoles('Safety Officer'), updateDriverSafety);

module.exports = router;