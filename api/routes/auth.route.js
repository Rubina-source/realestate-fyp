import express from 'express';
import {
    register,
    login,
    verifyEmail,
    getCurrentUser,
    updateProfile,
} from '../controllers/auth.controller.js';
import {
    authenticateToken
} from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, updateProfile);

export default router;