import Property from '../models/property.model.js';
import User from '../models/user.model.js';
import City from '../models/city.model.js';
import Favorite from '../models/favorite.model.js';
import jwt from 'jsonwebtoken';
import userViewHistoryModel from '../models/user-view-history.model.js';
import { createRoleNotifications } from '../utils/notification.js';

const buildDescriptionPrompt = (data) => {
  const {
    title = 'N/A',
    city = 'N/A',
    address = 'N/A',
    category = 'N/A',
    type = 'N/A',
    area = 'N/A',
    bedrooms = 'N/A',
    bathrooms = 'N/A',
    floors = 'N/A',
    parking = 'N/A',
    facing = 'N/A',
    year = 'N/A',
    roadWidth = 'N/A',
    roadType = 'N/A',
    amenities = 'N/A',
    price = 'N/A'
  } = data;

  return `Property Details:
- Title: ${title}
- City: ${city}
- Address/Locality: ${address}
- Category: ${category} (Residential / Commercial / Apartment / Land / House)
- Type: ${type} (Sale / Rent)
- Area: ${area}
- Bedrooms: ${bedrooms}
- Bathrooms: ${bathrooms}
- Floors: ${floors}
- Parking: ${parking} spaces
- Facing: ${facing}
- Year Built (BS): ${year}
- Road: ${roadWidth}, ${roadType}
- Amenities: ${amenities}
- Price: NPR ${price}`;
};

const DESCRIPTION_SYSTEM_PROMPT = `You are a professional Nepal real estate copywriter. Write a compelling, accurate, and natural-sounding property listing description in English based on the details below.

Writing Guidelines:
- Start with a strong hook that highlights the most attractive feature (location, size, or unique amenity)
- Mention the neighborhood context (e.g., nearness to hospitals, schools, markets)
- Highlight road access and facing direction naturally (East-facing is desirable in Nepal)
- Weave in 3–5 standout amenities naturally into the description
- End with a clear call-to-action encouraging the buyer/renter to contact
- Tone: Professional yet warm, like a trusted local agent
- Length: 80–120 words
- Do NOT use bullet points — write in flowing paragraph form
- Do NOT mention the price in the description

Return only the description text. No titles, no labels, no extra formatting.`;

export const generatePropertyDescription = async (req, res, next) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'openrouter/free';

    if (!apiKey) {
      return res.status(500).json({
        message: 'OpenRouter API key is not configured on server.'
      });
    }

    const userPrompt = buildDescriptionPrompt(req.body || {});

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:5173',
        'X-Title': process.env.OPENROUTER_APP_NAME || 'GharRush'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: DESCRIPTION_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: data?.error?.message || 'Failed to generate description from OpenRouter.'
      });
    }

    const description = data?.choices?.[0]?.message?.content?.trim();

    if (!description) {
      return res.status(502).json({
        message: 'OpenRouter returned an empty description.'
      });
    }

    res.json({ description });
  } catch (error) {
    next(error);
  }
};

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

    await createRoleNotifications({
      role: 'admin',
      actorId: req.user.userId,
      type: 'property_submission_requested',
      title: 'New property approval request',
      message: `${broker.name} submitted "${property.title}" for approval.`,
      link: '/admin/listings/pending',
      entityType: 'property',
      entityId: property._id,
    });

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

    const normalizePurpose = (value) => {
      if (!value) return "";
      const normalized = String(value).toLowerCase();
      if (normalized === 'buy' || normalized === 'sale' || normalized === 'sell') return 'sale';
      if (normalized === 'rent') return 'rent';
      return '';
    };

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
    const normalizedPurpose = normalizePurpose(purpose);
    if (normalizedPurpose) {
      filter.purpose = normalizedPurpose;
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
    let resubmittedForApproval = false;
    if (property.status === 'rejected') {
      property.status = 'pending';
      property.rejectionReason = null;
      resubmittedForApproval = true;
    }

    await property.save();
    await property.populate('broker', 'name phone company');

    if (resubmittedForApproval) {
      await createRoleNotifications({
        role: 'admin',
        actorId: req.user.userId,
        type: 'property_resubmission_requested',
        title: 'Property resubmitted for approval',
        message: `${broker.name} resubmitted "${property.title}" for approval.`,
        link: '/admin/listings/pending',
        entityType: 'property',
        entityId: property._id,
      });
    }

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