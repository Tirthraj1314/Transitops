const express = require('express');
const router = express.Router();
const { getInvoices, markInvoicePaid } = require('../controllers/invoiceController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', authorizeRoles('Finance Manager'), getInvoices);
router.patch('/:id/pay', authorizeRoles('Finance Manager'), markInvoicePaid);

module.exports = router;
