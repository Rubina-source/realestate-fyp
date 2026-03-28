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