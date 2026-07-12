const express = require('express');
const router = express.Router();
const { createCompany, getCompanies, updateCompany, deleteCompany } = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(protect, authorizeRoles('Super Admin'));

router.route('/')
  .post(createCompany)
  .get(getCompanies);

router.route('/:id')
  .put(updateCompany)
  .delete(deleteCompany);

module.exports = router;
