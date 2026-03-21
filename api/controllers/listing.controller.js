import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || '';

    // This searches through your 2211 properties by Title, City, or Address
    const listings = await Listing.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { city: { $regex: searchTerm, $options: 'i' } },
        { address: { $regex: searchTerm, $options: 'i' } },
      ],
    })
      .limit(limit)
      .skip(startIndex)
      .sort({ createdAt: -1 });

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, 'Listing not found!'));
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};