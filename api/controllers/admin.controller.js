import propertyModel from "../models/property.model.js";
import userModel from "../models/user.model.js";

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
            .select('name email phone company city image')
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