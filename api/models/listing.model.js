import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    price: { type: Number, required: true },
    bedroom: { type: Number, default: 0 },
    bathroom: { type: Number, default: 0 },
    floors: { type: String },
    parking: { type: Number, default: 0 },
    face: { type: String },
    year: { type: String },
    area: { type: String },
    road: { type: String },
    amenities: { type: [String] },
    image: { 
        type: String, 
        default: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" 
    }
}, { timestamps: true });

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;