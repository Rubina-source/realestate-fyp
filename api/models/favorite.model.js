import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Ensure one user can't favorite the same property twice
favoriteSchema.index({
    user: 1,
    property: 1
}, {
    unique: true
});

export default mongoose.model('Favorite', favoriteSchema);