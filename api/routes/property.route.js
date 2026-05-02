import express from 'express';
import {
    createProperty,
    getAllProperties,
    getPropertyById,
    getSimilarProperties,
    updateProperty,
    deleteProperty,
    getBrokerProperties,
    generatePropertyDescription,
} from '../controllers/property.controller.js';
import {
    getPublicBrokers,
    getPublicBrokerProfile
} from '../controllers/admin.controller.js';
import {
    authenticateToken,
    authorize,
    maybeAuthenticated
} from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', maybeAuthenticated, getAllProperties);
router.get('/brokers/public/all', getPublicBrokers);
router.get('/brokers/public/:brokerId', getPublicBrokerProfile);
router.get('/:id/similar', maybeAuthenticated, getSimilarProperties);
router.get('/:id', maybeAuthenticated, getPropertyById);

// Broker routes
router.post('/', authenticateToken, authorize(['broker']), createProperty);
router.post('/generate-description', authenticateToken, authorize(['broker']), generatePropertyDescription);
router.put('/:id', authenticateToken, authorize(['broker']), updateProperty);
router.delete('/:id', authenticateToken, authorize(['broker']), deleteProperty);
router.get('/broker/all', authenticateToken, authorize(['broker']), getBrokerProperties);

export default router;