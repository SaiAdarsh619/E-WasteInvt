import express from 'express';
import {
  getInventory,
  stockIn,
  stockOut,
  updateInventory,
} from '../controllers/inventoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, getInventory);
router.post('/stock-in', protect, authorize('admin', 'inventory_manager'), stockIn);
router.post('/stock-out', protect, authorize('admin', 'inventory_manager'), stockOut);
router.put('/:id', protect, authorize('admin', 'inventory_manager'), updateInventory);

export default router;
