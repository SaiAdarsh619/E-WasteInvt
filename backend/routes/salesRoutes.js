import express from 'express';
import {
  getSales,
  createSale,
  createDisposal,
  getDisposals,
} from '../controllers/salesController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getSales)
  .post(protect, authorize('admin', 'inventory_manager'), createSale);

router.post('/dispose', protect, authorize('admin', 'inventory_manager'), createDisposal);
router.get('/disposals', protect, getDisposals);

export default router;
