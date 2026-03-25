import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    price: { type: Number, required: true },
    bedroom: { type: Number, default: 0 },
    bathroom: { type: Number, default: 0 },
    floors: { type: Number, default: 0 },
    parking: { type: String, default: "No" },
    face: { type: String },
    year: { type: Number },
    views: { type: Number, default: 0 },
    area: { type: String },
    roadWidth: { type: String },
    roadType: { type: String },
    posted: { type: String },
    amenities: { type: Array, default: [] },
    category: { type: String, required: true },
    type: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    imageUrls: { type: Array, required: true },
    userRef: { type: String, required: true },
    status: { type: String, default: 'approved' },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;