import User from '../models/user.model.js';
import userViewHistoryModel from '../models/user-view-history.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import favoriteModel from '../models/favorite.model.js';

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) return next(errorHandler(401, 'Unauthorized'));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
          phone: req.body.phone,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) return next(errorHandler(401, 'Unauthorized'));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const userId = req.user.userId;
    const skip = (page - 1) * limit;

    // Get user's recent views with property details
    const recentViews = await userViewHistoryModel.find({ user: userId })
      .populate({
        path: 'property',
        // select: 'title price type purpose images location broker viewHistory',
        populate: [{
          path: 'broker',
          select: 'name phone company',
        }, {
          path: 'city',
          select: 'name',
        }],
      })
      .sort({ viewedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Enrich with view count and isFavorite
    const favorites = await favoriteModel.find({
      user: userId,
      property: { $in: recentViews.map(v => v.property._id) },
    }).select('property');
    const favoriteIds = new Set(favorites.map(f => f.property.toString()));

    const enrichedViews = recentViews.map(view => ({
      viewedAt: view.viewedAt,
      property: {
        ...view.property.toObject(),
        views: new Set((view.property.viewHistory || []).map(v => v.ip)).size,
        isFavorite: favoriteIds.has(view.property._id.toString()),
      },
    }));

    const total = await userViewHistoryModel.countDocuments({ user: userId });

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      recentlyViewed: enrichedViews,
    });
  } catch (error) {
    next(error);
  }
};