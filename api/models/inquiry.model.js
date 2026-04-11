import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true,
        index: true,
    },
    broker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
    },
    preferredMeetingDate: {
        type: Date,
        index: true,
    },
    // Inquiry Status
    status: {
        type: String,
        enum: ['Pending', 'Responded', 'Archived'],
        default: 'Pending',
        index: true,
    },
    brokerMessage: {
        type: String,
        trim: true,
    },
    respondedAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
});

// Indexes for efficient querying
inquirySchema.index({
    broker: 1,
    createdAt: -1
});
inquirySchema.index({
    broker: 1,
    status: 1
});
inquirySchema.index({
    property: 1,
    preferredMeetingDate: 1
});
inquirySchema.index({
    client: 1,
    createdAt: -1
});

export default mongoose.model('Inquiry', inquirySchema);