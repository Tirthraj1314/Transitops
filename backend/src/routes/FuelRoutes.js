const express = require('express');
const router = express.Router();
const { createFuelLog, getFuelLogs, deleteFuelLog } = require('../controllers/fuelController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .post(authorizeRoles('Finance Manager'), createFuelLog)
  .get(getFuelLogs);

router.delete('/:id', authorizeRoles('Finance Manager'), deleteFuelLog);

module.exports = router;