import express from 'express';
import {
    getAllUsers,
} from '../controllers/admin.controller.js';
import {
    authenticateToken,
    authorize
} from '../middleware/auth.js';

const router = express.Router();

router.get('/users', authenticateToken, authorize(['admin']), getAllUsers);

export default router;