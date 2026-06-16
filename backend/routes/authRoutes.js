import express from 'express';
import { registerUser, loginUser, logoutUser, getMe, getUsers } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getUsers);

export default router;
