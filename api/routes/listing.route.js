import express from 'express';
import { getListings } from '../controllers/listing.controller.js';

const router = express.Router();

router.get('/get', getListings);

export default router;