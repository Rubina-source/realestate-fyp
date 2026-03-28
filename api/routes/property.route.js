import express from 'express';
import {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getBrokerProperties,
} from '../controllers/property.controller.js';
import {
    getPublicBrokers
} from '../controllers/admin.controller.js';
import {
    authenticateToken,
    authorize
} from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.get('/brokers/public/all', getPublicBrokers);

// Broker routes
router.post('/', authenticateToken, authorize(['broker']), createProperty);
router.put('/:id', authenticateToken, authorize(['broker']), updateProperty);
router.delete('/:id', authenticateToken, authorize(['broker']), deleteProperty);
router.get('/broker/all', authenticateToken, authorize(['broker']), getBrokerProperties);

export default router;