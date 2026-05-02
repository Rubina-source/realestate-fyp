import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive'],
  },
  type: {
    type: String,
    enum: ['apartment', 'land', 'house', 'commercial', 'office'],
    required: [true, 'Property type is required'],
  },
  purpose: {
    type: String,
    enum: ['sale', 'rent'],
    required: [true, 'Purpose is required'],
  },
  rentalType: {
    type: String,
    enum: ['daily', 'monthly', 'yearly'],
    default: null,
  },
  size: {
    value: {
      type: Number,
      required: [true, 'Size value is required'],
      min: [0, 'Size must be positive'],
    },
    unit: {
      type: String,
      enum: ['sqft', 'ropani', 'aana'],
      default: 'sqft',
    },
  },
  bedrooms: {
    type: Number,
    default: null,
    min: [0, 'Bedrooms must be positive'],
  },
  bathrooms: {
    type: Number,
    default: null,
    min: [0, 'Bathrooms must be positive'],
  },
  parking: {
    type: Number,
    default: null,
    min: [0, 'Parking must be positive'],
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: [true, 'City is required'],
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required'],
    },
  },
  images: {
    type: [String],
    /* validate: [
      {
        validator: function (arr) {
          return arr.length >= 1 && arr.length <= 5;
        },
        message: 'Must have 1-5 images',
      },
    ], */
  },
  amenities: [{
    type: String,
    /* enum: [
      'Bathroom',
      'Living room',
      'Terrace',
      'Security',
      'Price negotiable',
      'Garden',
      'Swimming Pool',
      'Gym',
      'Lift',
      'Water Supply',
      'Electricity Backup',
      'Internet',
      'Kitchen',
      'Balcony',
      'Parking',
      'CCTV',
      'Water Supply',
      'Internet',
      'Store Room',
      'Fencing',
    ], */
  },],
  broker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'sold', 'expired'],
    default: 'pending',
  },
  rejectionReason: {
    type: String,
    default: null,
  },
  views: {
    type: Number,
    default: 0,
  },
  viewHistory: [{
    ip: String,
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

propertySchema.index({
  'location.city': 1,
  status: 1
});
propertySchema.index({
  broker: 1,
  status: 1
});

export default mongoose.model('Property', propertySchema);