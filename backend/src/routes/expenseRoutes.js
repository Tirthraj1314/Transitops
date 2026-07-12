const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .post(authorizeRoles('Fleet Manager', 'Dispatcher'), createExpense)
  .get(getExpenses);

router.delete('/:id', authorizeRoles('Fleet Manager'), deleteExpense);

module.exports = router;