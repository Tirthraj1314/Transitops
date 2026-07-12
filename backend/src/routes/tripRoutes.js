const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(protect);

// Must come before /:id so "my" isn't parsed as an id.
router.get('/my', authorizeRoles('Driver'), getMyTrips);

router.route('/')
  .post(authorizeRoles('Dispatcher'), createTrip)
  .get(getTrips);

router.get('/:id', getTripById);
router.patch('/:id/dispatch', authorizeRoles('Dispatcher'), dispatchTrip);
router.patch('/:id/start', authorizeRoles('Driver'), startTrip);
router.patch('/:id/reject', authorizeRoles('Driver'), rejectTrip);
router.patch('/:id/report-issue', authorizeRoles('Driver'), reportIssue);
router.patch('/:id/complete', authorizeRoles('Dispatcher', 'Driver'), completeTrip);
router.patch('/:id/cancel', authorizeRoles('Dispatcher'), cancelTrip);

module.exports = router;
