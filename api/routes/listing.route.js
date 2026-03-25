import express from 'express';
import { 
  createListing, 
  deleteListing, 
  getListings, 
  getListing, 
  updateListingStatus, 
  getUserListings 
} from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/get', getListings);
router.get('/get/:id', getListing);

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.patch('/update-status/:id', verifyToken, updateListingStatus);
router.get('/user/:id', verifyToken, getUserListings);

export default router;