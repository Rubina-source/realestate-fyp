import Property from '../models/property.model.js';
import Inquiry from '../models/inquiry.model.js';
import User from '../models/user.model.js';
import { createNotification } from '../utils/notification.js';

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

        await createNotification({
            recipientId: property.broker._id,
            actorId: userId,
            type: 'new_property_inquiry',
            title: 'New inquiry received',
            message: `A client sent an inquiry for "${property.title}".`,
            link: '/broker/dashboard',
            entityType: 'inquiry',
            entityId: inquiry._id,
        });

        await createNotification({
            recipientId: userId,
            actorId: property.broker._id,
            type: 'inquiry_submitted',
            title: 'Inquiry submitted',
            message: `Your inquiry for "${property.title}" has been sent to the broker.`,
            link: `/listings/${property._id}`,
            entityType: 'inquiry',
            entityId: inquiry._id,
        });

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
export const getBrokerInquiries = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const inquiries = await Inquiry.find({ broker: req.user.userId })
            .populate('property', 'title images price location city')
            .populate('client', 'name email phone profileImage')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Inquiry.countDocuments({ broker: req.user.userId });

        res.json({
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            inquiries,
        });
    } catch (error) {
        next(error);
    }
};

export const createBrokerInquiry = async (req, res, next) => {
    try {
        const { brokerId, message } = req.body;
        const userId = req.user.userId;

        if (!brokerId || !message) {
            return res.status(400).json({
                message: 'Broker and message are required',
            });
        }

        const broker = await User.findById(brokerId).select('name role');
        if (!broker || broker.role !== 'broker') {
            return res.status(404).json({
                message: 'Broker not found',
            });
        }

        const client = await User.findById(userId).select('name email');

        const inquiry = new Inquiry({
            broker: broker._id,
            client: userId,
            message,
        });

        await inquiry.save();

        const clientLabel = client?.name || client?.email || 'Someone';

        await createNotification({
            recipientId: broker._id,
            actorId: userId,
            type: 'new_broker_message',
            title: 'New message received',
            message: `You got new message from ${clientLabel}.`,
            link: '/broker/inquiries',
            entityType: 'inquiry',
            entityId: inquiry._id,
        });

        res.status(201).json({
            message: 'Message sent successfully. Broker will contact you soon.',
            inquiry,
        });
    } catch (error) {
        next(error);
    }
};