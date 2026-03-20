import Listing from '../models/listing.model.js';

export const getListings = async (req, res, next) => {
    try {
        const listings = await Listing.find().sort({ createdAt: -1 }).limit(20);
        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};