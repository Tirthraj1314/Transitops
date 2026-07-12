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
  .post(authorizeRoles('Dispatcher', 'Fleet Manager'), createTrip)
  .get(getTrips);

router.get('/:id', getTripById);
router.patch('/:id/dispatch', authorizeRoles('Dispatcher', 'Fleet Manager'), dispatchTrip);
router.patch('/:id/complete', authorizeRoles('Dispatcher', 'Fleet Manager'), completeTrip);
router.patch('/:id/cancel', authorizeRoles('Dispatcher', 'Fleet Manager'), cancelTrip);

module.exports = router;