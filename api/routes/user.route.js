import express from 'express';
import { updateUser, deleteUser, getHistory } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/update/:id', authenticateToken, updateUser);
router.delete('/delete/:id', authenticateToken, deleteUser);
router.get('/history', authenticateToken, getHistory);

export default router;