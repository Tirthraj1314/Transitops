const express = require('express');
const router = express.Router();
const { getReport, exportReportCSV } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', authorizeRoles('FinancialAnalyst', 'FleetManager'), getReport);
router.get('/export/csv', authorizeRoles('FinancialAnalyst', 'FleetManager'), exportReportCSV);

module.exports = router;