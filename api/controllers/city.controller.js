import City from '../models/city.model.js';

export const getCities = async (req, res) => {
  try {
    const cities = await City.find().sort({
      name: 1
    });

    res.json({
      success: true,
      data: cities,
      total: cities.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cities',
      error: error.message,
    });
  }
};

export const createCity = async (req, res) => {
  try {
    const {
      name
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'City name is required'
      });
    }

    const existingCity = await City.findOne({
      name
    });
    if (existingCity) {
      return res.status(400).json({
        message: 'City already exists'
      });
    }

    const city = new City({
      name
    });
    await city.save();

    res.status(201).json({
      success: true,
      message: 'City created successfully',
      data: city,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create city',
      error: error.message,
    });
  }
};

export const updateCity = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const {
      name
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'City name is required'
      });
    }

    const city = await City.findByIdAndUpdate(
      id, {
        name
      }, {
        new: true
      }
    );

    if (!city) {
      return res.status(404).json({
        message: 'City not found'
      });
    }

    res.json({
      success: true,
      message: 'City updated successfully',
      data: city,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update city',
      error: error.message,
    });
  }
};

export const deleteCity = async (req, res) => {
  try {
    const {
      id
    } = req.params;

    const city = await City.findByIdAndDelete(id);

    if (!city) {
      return res.status(404).json({
        message: 'City not found'
      });
    }

    res.json({
      success: true,
      message: 'City deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete city',
      error: error.message,
    });
  }
};