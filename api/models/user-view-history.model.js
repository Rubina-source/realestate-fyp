import mongoose from 'mongoose';

const userViewHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true,
        index: true,
    },
    viewedAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
}, {
    timestamps: true
});

userViewHistorySchema.index({ user: 1, property: 1 }, { unique: true });

userViewHistorySchema.index({
    user: 1,
    viewedAt: -1
}, {
    sparse: true
});

export default mongoose.model('UserViewHistory', userViewHistorySchema);