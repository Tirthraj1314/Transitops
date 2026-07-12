const express = require('express');
const router = express.Router();
const { getReport, exportReportCSV } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', authorizeRoles('Finance Manager', 'Fleet Manager'), getReport);
router.get('/export/csv', authorizeRoles('Finance Manager', 'Fleet Manager'), exportReportCSV);

module.exports = router;