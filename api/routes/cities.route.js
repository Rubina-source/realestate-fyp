import express from 'express';
import {
  getCities,
  createCity,
  updateCity,
  deleteCity,
} from '../controllers/city.controller.js';
import {
  authenticateToken,
  authorize
} from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getCities);

// Admin routes (to manage cities)
router.post('/', authenticateToken, authorize(['admin']), createCity);
router.put('/:id', authenticateToken, authorize(['admin']), updateCity);
router.delete('/:id', authenticateToken, authorize(['admin']), deleteCity);

export default router;