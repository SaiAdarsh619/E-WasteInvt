import express from 'express';
import {
  getComponents,
  getComponent,
  createComponent,
  updateComponent,
  deleteComponent,
} from '../controllers/componentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getComponents)
  .post(protect, authorize('admin', 'technician'), createComponent);

router
  .route('/:id')
  .get(protect, getComponent)
  .put(protect, authorize('admin', 'technician'), updateComponent)
  .delete(protect, authorize('admin'), deleteComponent);

export default router;
