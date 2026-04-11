import Property from '../models/property.model.js';
import User from '../models/user.model.js';
import City from '../models/city.model.js';
import Favorite from '../models/favorite.model.js';
import jwt from 'jsonwebtoken';
import userViewHistoryModel from '../models/user-view-history.model.js';

export const createProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      type,
      purpose,
      size,
      location,
      images,
      amenities,
      rentalType,
      city,
      bedrooms,
      bathrooms,
      parking
    } = req.body;

    // Check if broker is verified
    const broker = await User.findById(req.user.userId);
    if (broker.role === 'broker' && !broker.isBrokerVerified) {
      return res.status(403).json({
        message: 'Your broker account is not verified by admin. You cannot create listings until approved.'
      });
    }

    // Validation
    if (!title || !description || !price || !type || !purpose || !location || !images || !city) {
      return res.status(400).json({
        message: 'All required fields must be provided'
      });
    }

    if (!['apartment', 'land', 'house', 'commercial', 'office'].includes(type)) {
      return res.status(400).json({
        message: 'Invalid property type'
      });
    }

    if (!['sale', 'rent'].includes(purpose)) {
      return res.status(400).json({
        message: 'Purpose must be sale or rent'
      });
    }
    // Validate rentalType if purpose is rent
    if (purpose === 'rent' && rentalType) {
      if (!["daily", 'monthly', 'yearly'].includes(rentalType)) {
        return res.status(400).json({
          message: 'Invalid rental type'
        });
      }
    }
    if (images.length < 1 || images.length > 5) {
      return res.status(400).json({
        message: 'Upload 1-5 images'
      });
    }

    const property = new Property({
      title,
      description,
      price,
      type,
      purpose,
      rentalType: rentalType || null,
      city,
      size,
      bedrooms: bedrooms || null,
      bathrooms: bathrooms || null,
      parking: parking || null,
      location,
      images,
      amenities: amenities || [],
      broker: req.user.userId,
      status: 'pending',
    });

    await property.save();
    await property.populate('broker', 'name email phone');

    res.status(201).json({
      message: 'Property listed successfully. Awaiting admin approval.',
      property,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProperties = async (req, res, next) => {
  try {
    // Get userId if available (user might be logged in or not)
    let decoded = null;
    let userId = null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded?.userId;
      } catch (e) {
        // Invalid token, treat as not logged in, do not throw
        decoded = null;
        userId = null;
      }
    }

    const {
      keyword,
      priceMin,
      priceMax,
      sizeMin,
      sizeMax,
      sizeUnit,
      type,
      types,
      purpose,
      city,
      rentalType,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {
      status: 'approved'
    };

    // Keyword search
    if (keyword) {
      filter.$or = [{
          title: {
            $regex: keyword,
            $options: 'i'
          }
        },
        {
          description: { $regex: keyword, $options: 'i' }
        },
        {
          'location.address': { $regex: keyword, $options: 'i' }
        },
      ];
    }

    // Price filter
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    // Size filter
    if (sizeMin || sizeMax) {
      filter['size.value'] = {};
      if (sizeMin) filter['size.value'].$gte = Number(sizeMin);
      if (sizeMax) filter['size.value'].$lte = Number(sizeMax);
    }

    // Size unit filter
    if (sizeUnit) {
      filter['size.unit'] = sizeUnit;
    }

    // Type filter - support both 'type' and 'types' parameters
    if (types) {
      const typeArray = types.split(',').map(t => t.trim());
      filter.type = { $in: typeArray };
    } else if (type) {
      filter.type = type;
    }

    // Purpose filter
    if (purpose) {
      filter.purpose = purpose;
    }

    // Rental type filter
    if (rentalType) {
      filter.rentalType = rentalType;
    }

    // City filter
    if (city) {
      filter.city = city;
    }

    // Sorting
    let sortBy = { createdAt: -1 };
    if (sort === 'price-low') {
      sortBy = { price: 1 };
    } else if (sort === 'price-high') {
      sortBy = { price: -1 };
    } else if (sort === 'newest') {
      sortBy = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;
    console.log('Filter:', filter);

    const properties = await Property.find(filter)
      .populate('broker', 'name phone company')
      .populate('city', 'name')
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit));

    // Get user's favorite properties if authenticated (via header or req.user)
    let favoritePropertyIds = new Set();
    if (userId) {
      const propertyIds = properties.map(p => p._id);
      const favorites = await Favorite.find({
        user: userId,
        property: { $in: propertyIds }
      }).select('property');
      favoritePropertyIds = new Set(favorites.map(f => f.property.toString()));
    }

    // Add isFavorite field to each property
    const propertiesWithFavorite = properties.map(p => ({
      ...p.toObject(),
      isFavorite: favoritePropertyIds.has(p._id.toString())
    }));

    const total = await Property.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      properties: propertiesWithFavorite,
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate('broker', 'name email phone company profileImage');

    if (!property) {
      return res.status(404).json({
        message: 'Property not found'
      });
    }

    let userId = req.user?.userId;

    // Get user's IP address
    const userIp = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown';

    if (!userId) {
      property.viewHistory.push({
        ip: userIp,
        viewedAt: new Date()
      });
      await property.save();
    }

    // Calculate unique IPs for response
    const uniqueIPs = new Set(property.viewHistory.map(v => v.ip)).size;
    const totalViews = property.viewHistory.length;

    let isFavorite = false;
    if (userId) {
      const favorite = await Favorite.findOne({
        user: userId,
        property: req.params.id
      });
      isFavorite = !!favorite;
      const existingHistory = await userViewHistoryModel.findOne({
        user: userId,
        property: req.params.id
      });
      if (existingHistory) {
        existingHistory.viewedAt = new Date();
        await existingHistory.save();
      } else {
        await userViewHistoryModel.create({
          user: userId,
          property: req.params.id,
          viewedAt: new Date(),
        });
      }
    }

    res.json({
      property: {
        ...property.toObject(),
        views: uniqueIPs,
        totalViews: totalViews,
        isFavorite: isFavorite
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: 'Property not found'
      });
    }

    // Only broker who created it can edit (and only if pending/rejected)
    if (property.broker.toString() !== req.user.userId) {
      return res.status(403).json({
        message: 'Not authorized to edit this property'
      });
    }

    // Check if broker is verified
    const broker = await User.findById(req.user.userId);
    if (broker.role === 'broker' && !broker.isBrokerVerified) {
      return res.status(403).json({
        message: 'Your broker account is not verified by admin. You cannot edit listings.'
      });
    }

    const {
      title,
      description,
      price,
      type,
      purpose,
      size,
      location,
      images,
      amenities,
      rentalType,
      city,
      bedrooms,
      bathrooms,
      parking,
      status
    } = req.body;

    if (title) property.title = title;
    if (description) property.description = description;
    if (price) property.price = price;
    if (type) property.type = type;
    if (purpose) property.purpose = purpose;
    if (rentalType) property.rentalType = rentalType;
    if (city) property.city = city;
    if (size) property.size = size;
    if (location) property.location = location;
    if (images) property.images = images;
    if (bedrooms !== undefined) property.bedrooms = bedrooms || null;
    if (bathrooms !== undefined) property.bathrooms = bathrooms || null;
    if (parking !== undefined) property.parking = parking || null;
    if (amenities) property.amenities = amenities;
    if (status && property.status === 'approved') property.status = status;
    if (status && property.status === 'sold') property.status = status;
    // If property was rejected, set status back to pending
    if (property.status === 'rejected') {
      property.status = 'pending';
      property.rejectionReason = null;
    }

    await property.save();
    await property.populate('broker', 'name phone company');

    res.json({
      message: 'Property updated and resubmitted for approval',
      property,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: 'Property not found'
      });
    }

    if (property.broker.toString() !== req.user.userId) {
      return res.status(403).json({
        message: 'Not authorized to delete this property'
      });
    }

    // Check if broker is verified
    const broker = await User.findById(req.user.userId);
    if (broker.role === 'broker' && !broker.isBrokerVerified) {
      return res.status(403).json({
        message: 'Your broker account is not verified by admin. You cannot delete listings.'
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Property deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getBrokerProperties = async (req, res, next) => {
  try {
    const {
      status,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {
      broker: req.user.userId
    };
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const properties = await Property.find(filter)
      .sort({
        createdAt: -1
      })
      .skip(skip)
      .limit(Number(limit));

    // Get user's favorite properties
    const propertyIds = properties.map(p => p._id);
    const favorites = await Favorite.find({
      user: req.user.userId,
      property: {
        $in: propertyIds
      }
    }).select('property');
    const favoritePropertyIds = new Set(favorites.map(f => f.property.toString()));

    // Add isFavorite field to each property
    const propertiesWithFavorite = properties.map(p => ({
      ...p.toObject(),
      isFavorite: favoritePropertyIds.has(p._id.toString())
    }));

    const total = await Property.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      properties: propertiesWithFavorite,
    });
  } catch (error) {
    next(error);
  }
};

export const bulkImportProperties = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      type,
      purpose,
      cityName,
      location,
      size,
      bedrooms,
      bathrooms,
      parking,
      amenities,
      rentalType,
      images,
      brokerId
    } = req.body;

    // Validate broker
    const broker = await User.findById(brokerId);
    if (!broker) {
      return res.status(404).json({
        message: 'Broker not found'
      });
    }

    // Validate required fields
    if (!title || !description || !price || !type || !purpose || !cityName || !location || !size) {
      return res.status(400).json({
        message: 'Missing required fields: title, description, price, type, purpose, city, location, size'
      });
    }

    // Validate property type
    if (!['apartment', 'land', 'house', 'commercial', 'office'].includes(type)) {
      return res.status(400).json({
        message: 'Invalid property type'
      });
    }

    // Validate purpose
    if (!['sale', 'rent'].includes(purpose)) {
      return res.status(400).json({
        message: 'Purpose must be sale or rent'
      });
    }

    // Validate rental type
    if (purpose === 'rent' && rentalType) {
      if (!['daily', 'monthly', 'yearly'].includes(rentalType)) {
        return res.status(400).json({
          message: 'Invalid rental type'
        });
      }
    }

    // Find city by name
    const city = await City.findOne({
      name: cityName
    });
    if (!city) {
      return res.status(404).json({
        message: `City "${cityName}" not found. Please add it first.`
      });
    }

    // Create property
    const property = new Property({
      title,
      description,
      price: Number(price),
      type,
      purpose,
      rentalType: rentalType || null,
      city: city._id,
      size,
      bedrooms: bedrooms || null,
      bathrooms: bathrooms || null,
      parking: parking || null,
      location,
      images: images && images.length > 0 ? images : [
        'https://placehold.co/600x400'
      ],
      amenities: amenities || [],
      broker: brokerId,
      status: 'approved', // Admin-imported properties are auto-approved
    });

    await property.save();
    await property.populate('broker', 'name email phone');

    res.status(201).json({
      message: 'Property imported successfully',
      property,
    });
  } catch (error) {
    next(error);
  }
};