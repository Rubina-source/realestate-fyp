export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const startIndex = parseInt(req.query.startIndex) || 0;

    // Build the query object dynamically
    let query = {};

    // 1. Search Term (Title/City)
    const searchTerm = req.query.searchTerm || '';
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { city: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    // 2. Category (House, Apartment, etc.)
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    // 3. Type (Sale/Rent)
    if (req.query.type && req.query.type !== 'all') {
      query.type = req.query.type;
    }

    // 4. Price Range
    const minPrice = parseInt(req.query.minPrice) || 0;
    const maxPrice = parseInt(req.query.maxPrice) || 1000000000;
    query.price = { $gte: minPrice, $lte: maxPrice };

    // 5. Bedrooms/Bathrooms (Only filter if it's a number, not 'any')
    if (req.query.bedroom && req.query.bedroom !== 'any') {
      query.bedroom = { $gte: parseInt(req.query.bedroom) };
    }
    if (req.query.bathroom && req.query.bathroom !== 'any') {
      query.bathroom = { $gte: parseInt(req.query.bathroom) };
    }

    // 6. Face/Direction
    if (req.query.face && req.query.face !== 'any' && req.query.face !== 'all') {
      query.face = req.query.face;
    }

    const listings = await Listing.find(query)
      .limit(limit)
      .skip(startIndex)
      .sort({ createdAt: -1 });

    return res.status(200).json(listings);
  } catch (error) {
    next(error); // This sends the error to your index.js handler
  }
}; 