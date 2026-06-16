import express from 'express';
import {
  getDevices,
  getDevice,
  createDevice,
  updateDevice,
  deleteDevice,
} from '../controllers/deviceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getDevices)
  .post(protect, authorize('admin', 'technician'), createDevice);

router
  .route('/:id')
  .get(protect, getDevice)
  .put(protect, authorize('admin', 'technician'), updateDevice)
  .delete(protect, authorize('admin'), deleteDevice);

export default router;
