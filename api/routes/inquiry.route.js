import express from 'express';
import {
    createInquiry,
} from '../controllers/inquiry.controller.js';
import {
    authenticateToken
} from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createInquiry);

export default router;