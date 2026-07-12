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
  .post(authorizeRoles('Dispatcher'), createTrip)
  .get(getTrips);

router.get('/:id', getTripById);
router.patch('/:id/dispatch', authorizeRoles('Dispatcher'), dispatchTrip);
router.patch('/:id/complete', authorizeRoles('Dispatcher'), completeTrip);
router.patch('/:id/cancel', authorizeRoles('Dispatcher'), cancelTrip);

module.exports = router;