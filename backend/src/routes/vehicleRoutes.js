const express = require('express');
const router = express.Router();
const {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  uploadVehicleDocument,
  getVehicleOperationalCost,
} = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(protect);

router.get('/:id/cost', getVehicleOperationalCost);

router.route('/')
  .post(authorizeRoles('Fleet Manager'), createVehicle)
  .get(getVehicles); // any authenticated role can view

router.route('/:id')
  .get(getVehicleById)
  .put(authorizeRoles('Fleet Manager'), updateVehicle)
  .delete(authorizeRoles('Fleet Manager'), deleteVehicle);

router.post('/:id/documents', authorizeRoles('Fleet Manager'), upload.single('file'), uploadVehicleDocument);

module.exports = router;
