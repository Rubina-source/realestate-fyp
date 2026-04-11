import express from 'express';
import {
    addFavorite,
    removeFavorite,
    getFavorites,
    isFavorite,
} from '../controllers/favorite.controller.js';
import {
    authenticateToken
} from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getFavorites);
router.post('/:propertyId', authenticateToken, addFavorite);
router.delete('/:propertyId', authenticateToken, removeFavorite);
router.get('/:propertyId/check', authenticateToken, isFavorite);

export default router;