import express from 'express';
import { getListings, getListing } from '../controllers/listing.controller.js';

const router = express.Router();

router.get('/get', getListings);
// Add this below your other routes
router.get('/get/:id', getListing);

export default router;