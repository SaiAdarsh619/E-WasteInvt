import express from 'express';
import { getStats, getMonthlyStats } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, getStats);
router.get('/monthly', protect, getMonthlyStats);

export default router;
