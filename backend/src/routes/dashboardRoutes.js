const express = require('express');
const router = express.Router();
const { getDashboardKPIs } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getDashboardKPIs);

module.exports = router;