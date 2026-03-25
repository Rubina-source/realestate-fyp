import mongoose from 'mongoose';



const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "https://images.icon-icons.com/1674/PNG/512/person_110935.png" },
    role: { type: String, default: 'client' },
    // --- NEW BROKER FIELDS ---
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },
    specialization: { type: String, default: "Residential" }, // Rental, Residential, Commercial, Land
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;