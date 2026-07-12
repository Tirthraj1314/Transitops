const express = require('express');
const router = express.Router();
const {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getVehicleOperationalCost,
} = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

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

module.exports = router;