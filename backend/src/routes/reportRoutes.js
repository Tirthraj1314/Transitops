const express = require('express');
const router = express.Router();
const { getReport, exportReportCSV } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Every role sees a report scoped to them per docs/SPEC.md's permission
// matrix (Fleet/Operations/Safety/Finance/Personal); there's only one
// report type implemented so far, so it's open to any authenticated user.
router.get('/', getReport);
router.get('/export/csv', exportReportCSV);

module.exports = router;