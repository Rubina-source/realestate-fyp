import Property from '../models/property.model.js';
import Inquiry from '../models/inquiry.model.js';

export const createInquiry = async (req, res, next) => {
    try {
        const {
            propertyId,
            message,
            preferredMeetingDate
        } = req.body;
        const userId = req.user.userId;

        // Validation
        if (!propertyId || !message || !preferredMeetingDate) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        // Check property exists
        const property = await Property.findById(propertyId).populate('broker');
        if (!property) {
            return res.status(404).json({
                message: 'Property not found'
            });
        }

        // PESSIMISTIC LOCKING: Check if another inquiry exists for same property + meeting date
        if (preferredMeetingDate) {
            const meetingDate = new Date(preferredMeetingDate);
            const dateStart = new Date(meetingDate.setHours(0, 0, 0, 0));
            const dateEnd = new Date(meetingDate.setHours(23, 59, 59, 999));

            const existingInquiry = await Inquiry.findOne({
                property: propertyId,
                broker: property.broker._id,
                preferredMeetingDate: {
                    $gte: dateStart,
                    $lte: dateEnd,
                },
                status: {
                    $in: ['Pending', 'Responded']
                },
            });

            if (existingInquiry) {
                return res.status(409).json({
                    message: 'This meeting date is no longer available. Please select another date.',
                });
            }
        }

        // Create inquiry
        const inquiry = new Inquiry({
            property: propertyId,
            broker: property.broker._id,
            client: userId,
            message,
            preferredMeetingDate: preferredMeetingDate || undefined,
        });

        await inquiry.save();

        res.status(201).json({
            message: 'Inquiry sent successfully. Broker will contact you soon.',
            emailMessage: `Hello, I am interested in this property and would like to schedule a meeting${preferredMeetingDate ? ` on ${new Date(preferredMeetingDate).toLocaleDateString()}` : ''}. Please let me know if this works. Thank you.`,
            inquiry,
        });
    } catch (error) {
        if (error.code === 11000 || error.message.includes('duplicate')) {
            return res.status(409).json({
                message: 'Another inquiry for this meeting date already exists. Please choose another date.',
            });
        }
        next(error);
    }
};