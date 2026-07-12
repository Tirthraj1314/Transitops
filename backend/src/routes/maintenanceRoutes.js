const express = require('express');
const router = express.Router();
const {
  createMaintenance,
  getMaintenanceRecords,
  getMaintenanceById,
  closeMaintenance,
  updateMaintenance,
} = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .post(authorizeRoles('Fleet Manager'), createMaintenance)
  .get(getMaintenanceRecords);

router.get('/:id', getMaintenanceById);
router.put('/:id', authorizeRoles('Fleet Manager'), updateMaintenance);
router.patch('/:id/close', authorizeRoles('Fleet Manager'), closeMaintenance);

module.exports = router;