import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    bedroom: { type: Number, default: 0 },
    bathroom: { type: Number, default: 0 },
    floors: { type: Number, default: 0 },
    parking: { type: String, default: "No" },
    face: { type: String }, 
    year: { type: Number },
    views: { type: Number, default: 0 },
    area: { type: String }, // For Nepali measurements like 0-4-0-0
    road: { type: String }, 
    roadWidth: { type: String },
    roadType: { type: String },
    buildArea: { type: String },
    posted: { type: String },
    amenities: { type: Array, default: [] },
    type: { type: String, default: 'sale' }, 
    imageUrls: { type: Array, required: true },
    userRef: { type: String, required: true },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

// THIS LINE WAS MISSING AND CAUSED THE CRASH:
export default Listing;