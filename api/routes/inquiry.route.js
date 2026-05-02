import express from 'express';
import {
    createInquiry,
    createBrokerInquiry,
    getBrokerInquiries,
} from '../controllers/inquiry.controller.js';
import {
    authenticateToken,
    authorize
} from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createInquiry);
router.post('/broker', authenticateToken, createBrokerInquiry);

// for brokers
router.get('/', authenticateToken, authorize(['broker']), getBrokerInquiries);

export default router;