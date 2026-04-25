import propertyModel from "../models/property.model.js";
import userModel from "../models/user.model.js";
import inquiryModel from "../models/inquiry.model.js";
import { createNotification } from '../utils/notification.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const {
            role,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {};
        if (role) {
            filter.role = role;
        }

        const skip = (page - 1) * limit;

        const users = await userModel.find(filter)
            .select('-password')
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(Number(limit));

        const total = await userModel.countDocuments(filter);

        res.json({
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            users,
        });
    } catch (error) {
        next(error);
    }
};
export const getPendingBrokers = async (req, res, next) => {
    try {
        const {
            page = 1, limit = 10, city
        } = req.query;

        const skip = (page - 1) * limit;

        const query = {
            role: 'broker',
            isBrokerVerified: false
        };

        if (city) {
            query.city = city;
        }

        const brokers = await userModel.find(query)
            .select('-password')
            .populate('city')
            .sort({
                createdAt: 1
            })
            .skip(skip)
            .limit(Number(limit));

        const total = await userModel.countDocuments(query);

        res.json({
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            brokers,
        });
    } catch (error) {
        next(error);
    }
};

export const verifyBroker = async (req, res, next) => {
    try {
        const {
            userId
        } = req.params;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (user.role !== 'broker') {
            return res.status(400).json({
                message: 'This user is not a broker'
            });
        }

        user.isBrokerVerified = true;
        await user.save();

        await createNotification({
            recipientId: user._id,
            actorId: req.user.userId,
            type: 'broker_verification_approved',
            title: 'Broker verification approved',
            message: 'Your broker account has been approved by admin.',
            link: '/broker/dashboard',
            entityType: 'user',
            entityId: user._id,
        });

        res.json({
            message: 'Broker verified successfully',
            user: user.toObject({
                getters: true,
                virtuals: true,
                depopulate: true,
                minimize: false
            })
        });
    } catch (error) {
        next(error);
    }
};

export const rejectBroker = async (req, res, next) => {
    try {
        const {
            userId
        } = req.params;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (user.role !== 'broker') {
            return res.status(400).json({
                message: 'This user is not a broker'
            });
        }
        user.isBrokerVerified = false;
        await user.save();

        await createNotification({
            recipientId: user._id,
            actorId: req.user.userId,
            type: 'broker_verification_rejected',
            title: 'Broker verification rejected',
            message: 'Your broker verification request was rejected by admin. Please update your details and try again.',
            link: '/broker-signup',
            entityType: 'user',
            entityId: user._id,
        });

        res.json({
            message: 'Broker rejected successfully',
            user: user.toObject({
                getters: true,
                virtuals: true,
                depopulate: true,
                minimize: false
            })
        });
    } catch (error) {
        next(error);
    }
};
export const getListings = async (req, res, next) => {
    try {
        const {
            page = 1, limit = 10
        } = req.query;

        const skip = (page - 1) * limit;

        const properties = await propertyModel.find()
            .populate('broker', 'name email phone company')
            .populate('city', 'name')
            .sort({
                createdAt: 1
            })
            .skip(skip)
            .limit(Number(limit));

        const total = await propertyModel.countDocuments({
            // status: 'pending'
        });

        res.json({
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            properties,
        });
    } catch (error) {
        next(error);
    }
};
export const getPendingListings = async (req, res, next) => {
    try {
        const {
            page = 1, limit = 10
        } = req.query;

        const skip = (page - 1) * limit;

        const properties = await propertyModel.find({
                status: 'pending'
            })
            .populate('broker', 'name email phone company')
            .populate('city', 'name')
            .sort({
                createdAt: 1
            })
            .skip(skip)
            .limit(Number(limit));

        const total = await propertyModel.countDocuments({
            status: 'pending'
        });

        res.json({
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            properties,
        });
    } catch (error) {
        next(error);
    }
};
export const updatePropertyStatus = async (req, res, next) => {
    try {
        const {
            status,
            rejectionReason
        } = req.body;
        const {
            propertyId
        } = req.params;

        if (!['approved', 'rejected', 'sold', 'expired'].includes(status)) {
            return res.status(400).json({
                message: 'Invalid status'
            });
        }

        const property = await propertyModel.findByIdAndUpdate(
            propertyId, {
                status,
                ...(status === 'rejected' && rejectionReason && {
                    rejectionReason
                }),
            }, {
                new: true
            }
        ).populate('broker', 'name email phone');

        if (!property) {
            return res.status(404).json({
                message: 'Property not found'
            });
        }

        await createNotification({
            recipientId: property.broker?._id,
            actorId: req.user.userId,
            type: `property_${status}`,
            title: `Property ${status}`,
            message: status === 'rejected' && rejectionReason
                ? `Your property "${property.title}" was rejected. Reason: ${rejectionReason}`
                : `Your property "${property.title}" was marked as ${status}.`,
            link: '/broker/listings',
            entityType: 'property',
            entityId: property._id,
        });

        res.json({
            message: `Property status updated to ${status}`,
            property,
        });
    } catch (error) {
        next(error);
    }
};

export const getVerifiedBrokers = async (req, res, next) => {
    try {
        const {
            page = 1, limit = 10
        } = req.query;
        const skip = (page - 1) * limit;

        const brokers = await userModel.find({
                role: 'broker',
                isBrokerVerified: true
            })
            .select('-password')
            .populate('city', 'name')
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(Number(limit));

        const total = await userModel.countDocuments({
            role: 'broker',
            isBrokerVerified: true
        });

        res.json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            brokers,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllBrokers = async (req, res, next) => {
    try {
        const {
            page = 1, limit = 10
        } = req.query;
        const skip = (page - 1) * limit;

        const brokers = await userModel.find({
                role: 'broker',
                isBrokerVerified: true
            })
            .select('-password')
            .populate('city', 'name')
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(Number(limit));

        const total = await userModel.countDocuments({
            role: 'broker',
            isBrokerVerified: true
        });

        res.json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            brokers,
        });
    } catch (error) {
        next(error);
    }
};
export const getPublicBrokers = async (req, res, next) => {
    try {
        const {
            limit = 6
        } = req.query;

        const brokers = await userModel.find({
                role: 'broker',
                isBrokerVerified: true
            })
            // .select('name email phone company city image')
            .select('-password')
            .populate('city', 'name')
            .sort({
                createdAt: -1
            })
            .limit(Number(limit));

        res.json({
            success: true,
            data: {
                brokers,
                total: brokers.length,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getPublicBrokerProfile = async (req, res, next) => {
    try {
        const { brokerId } = req.params;
        const { limit = 3 } = req.query;

        const broker = await userModel.findOne({
            _id: brokerId,
            role: 'broker',
            isBrokerVerified: true,
        })
            .select('-password')
            .populate('city', 'name');

        if (!broker) {
            return res.status(404).json({
                message: 'Broker not found',
            });
        }

        const parsedLimit = Math.max(1, Math.min(Number(limit) || 3, 6));

        const recentListings = await propertyModel.find({
            broker: brokerId,
            status: 'approved',
        })
            .populate('city', 'name')
            .sort({ createdAt: -1 })
            .limit(parsedLimit);

        const totalApprovedListings = await propertyModel.countDocuments({
            broker: brokerId,
            status: 'approved',
        });

        res.json({
            success: true,
            data: {
                broker,
                totalApprovedListings,
                recentListings,
            },
        });
    } catch (error) {
        next(error);
    }
};


export const getStats = async (req, res, next) => {
    try {
        const totalUsers = await userModel.countDocuments();
        const brokerCount = await userModel.countDocuments({
            role: 'broker'
        });
        const clientCount = await userModel.countDocuments({
            role: 'client'
        });
        const pendingBrokers = await userModel.countDocuments({
            role: 'broker',
            isBrokerVerified: false
        });

        const totalListings = await propertyModel.countDocuments();
        const approvedListings = await propertyModel.countDocuments({
            status: 'approved'
        });
        const pendingListings = await propertyModel.countDocuments({
            status: 'pending'
        });
        const rejectedListings = await propertyModel.countDocuments({
            status: 'rejected'
        });

        const totalInquiries = await inquiryModel.countDocuments();

        res.json({
            users: {
                total: totalUsers,
                brokers: brokerCount,
                clients: clientCount,
            },
            listings: {
                total: totalListings,
                approved: approvedListings,
                pending: pendingListings,
                rejected: rejectedListings,
            },
            inquiries: totalInquiries,
            pendingBrokers,
        });
    } catch (error) {
        next(error);
    }
};

export const getPropertyStats = async (req, res, next) => {
    try {
        // Property type statistics
        const typeStats = await propertyModel.aggregate([{
                $match: {
                    status: 'approved'
                }
            },
            {
                $group: {
                    _id: '$type',
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    value: '$count'
                }
            },
        ]);

        // Purpose statistics (sale vs rent)
        const purposeStats = await propertyModel.aggregate([{
                $match: {
                    status: 'approved'
                }
            },
            {
                $group: {
                    _id: '$purpose',
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    value: '$count'
                }
            },
        ]);

        // City statistics (top cities by property count)
        const cityStats = await propertyModel.aggregate([{
                $match: {
                    status: 'approved'
                }
            },
            {
                $group: {
                    _id: '$city',
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $lookup: {
                    from: 'cities',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'cityInfo'
                }
            },
            {
                $unwind: '$cityInfo'
            },
            {
                $sort: {
                    count: -1
                }
            },
            {
                $limit: 10
            },
            {
                $project: {
                    _id: 0,
                    name: '$cityInfo.name',
                    value: '$count'
                }
            },
        ]);

        res.json({
            success: true,
            propertyType: typeStats,
            purpose: purposeStats,
            cities: cityStats,
        });
    } catch (error) {
        next(error);
    }
};