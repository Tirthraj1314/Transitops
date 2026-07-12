const express = require('express');
const router = express.Router();
const { createIncident, getIncidents, resolveIncident } = require('../controllers/incidentController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(protect, authorizeRoles('Safety Officer'));

router.route('/')
  .post(createIncident)
  .get(getIncidents);

router.patch('/:id/resolve', resolveIncident);

module.exports = router;
