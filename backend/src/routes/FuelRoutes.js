const express = require('express');
const router = express.Router();
const { createFuelLog, getFuelLogs, deleteFuelLog } = require('../controllers/fuelController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .post(authorizeRoles('Fleet Manager', 'Dispatcher'), createFuelLog)
  .get(getFuelLogs);

router.delete('/:id', authorizeRoles('Fleet Manager'), deleteFuelLog);

module.exports = router;