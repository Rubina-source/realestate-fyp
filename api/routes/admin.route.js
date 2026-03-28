import express from 'express';
import {
    getAllBrokers,
    getAllUsers,
    getListings,
    getPendingBrokers,
    getPendingListings,
    getVerifiedBrokers,
    rejectBroker,
    updatePropertyStatus,
    verifyBroker,
} from '../controllers/admin.controller.js';
import {
    authenticateToken,
    authorize
} from '../middleware/auth.js';

const router = express.Router();

router.get('/users', authenticateToken, authorize(['admin']), getAllUsers);

router.get('/brokers/pending', authenticateToken, authorize(['admin']), getPendingBrokers);
router.get('/brokers/verified', authenticateToken, authorize(['admin']), getVerifiedBrokers);
router.get('/brokers/all', authenticateToken, authorize(['admin']), getAllBrokers);
router.patch('/brokers/:userId/verify', authenticateToken, authorize(['admin']), verifyBroker);
router.patch('/brokers/:userId/reject', authenticateToken, authorize(['admin']), rejectBroker);

// Admin routes - require admin role
router.get('/listings/pending', authenticateToken, authorize(['admin']), getPendingListings);
router.get('/listings/all', authenticateToken, authorize(['admin']), getListings);
router.patch('/listings/:propertyId/status', authenticateToken, authorize(['admin']), updatePropertyStatus);
export default router;