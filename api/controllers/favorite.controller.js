import Favorite from '../models/favorite.model.js';
import Property from '../models/property.model.js';

export const addFavorite = async (req, res, next) => {
    try {
        const {
            propertyId
        } = req.params;

        // Check property exists
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({
                message: 'Property not found'
            });
        }

        // Check if already favorited
        const existing = await Favorite.findOne({
            user: req.user.userId,
            property: propertyId,
        });

        if (existing) {
            await Favorite.deleteOne({
                user: req.user.userId,
                property: propertyId
            });
            return res.status(200).json({
                message: 'Removed from favorites'
            });
        }
        const favorite = new Favorite({
            user: req.user.userId,
            property: propertyId
        });
        await favorite.save();
        return res.status(201).json({
            message: 'Added to favorites'
        });

    } catch (error) {
        next(error);
    }
};

export const removeFavorite = async (req, res, next) => {
    try {
        const {
            propertyId
        } = req.params;

        const favorite = await Favorite.findOneAndDelete({
            user: req.user.userId,
            property: propertyId,
        });

        if (!favorite) {
            return res.status(404).json({
                message: 'Favorite not found'
            });
        }

        res.json({
            message: 'Removed from favorites'
        });
    } catch (error) {
        next(error);
    }
};

export const getFavorites = async (req, res, next) => {
    try {
        const {
            page = 1, limit = 10
        } = req.query;

        const skip = (page - 1) * limit;

        const favorites = await Favorite.find({
                user: req.user.userId
            })
            .populate({
                path: 'property',
                populate: {
                    path: 'broker',
                    select: 'name phone company'
                },
            })
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(Number(limit));

        const total = await Favorite.countDocuments({
            user: req.user.userId
        });

        res.json({
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            favorites,
        });
    } catch (error) {
        next(error);
    }
};

export const isFavorite = async (req, res, next) => {
    try {
        const {
            propertyId
        } = req.params;

        const favorite = await Favorite.findOne({
            user: req.user.userId,
            property: propertyId,
        });

        res.json({
            isFavorite: !!favorite
        });
    } catch (error) {
        next(error);
    }
};