const express = require('express');
const router = express.Router();
const {
  createTrip,
  getTrips,
  getTripById,
  dispatchTrip,
  completeTrip,
  cancelTrip,
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .post(authorizeRoles('Driver', 'FleetManager'), createTrip)
  .get(getTrips);

router.get('/:id', getTripById);
router.patch('/:id/dispatch', authorizeRoles('Driver', 'FleetManager'), dispatchTrip);
router.patch('/:id/complete', authorizeRoles('Driver', 'FleetManager'), completeTrip);
router.patch('/:id/cancel', authorizeRoles('Driver', 'FleetManager'), cancelTrip);

module.exports = router;