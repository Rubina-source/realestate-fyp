import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

// --- SIGN UP LOGIC ---
export const signup = async (req, res, next) => {
    const { username, email, password, role } = req.body;
    
    // Simple validation
    if (!username || !email || !password) {
        return next(errorHandler(400, 'All fields are required!'));
    }

    if (username.length < 3) {
        return next(errorHandler(400, 'Username must be at least 3 characters long!'));
    }

    // Hash password for security
    const hashedPassword = bcryptjs.hashSync(password, 10);
    
    const newUser = new User({ 
        username, 
        email, 
        password: hashedPassword, 
        role: role || 'client' 
    });

    try {
        await newUser.save();
        res.status(201).json({
            success: true,
            message: "User created successfully!"
        });
    } catch (error) {
        // This handles duplicate email/username errors automatically
        next(error); 
    }
};

// --- SIGN IN LOGIC (The Missing Piece) ---
export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        // 1. Check if user exists
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User not found!'));

        // 2. Check if password is correct
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

        // 3. Create a JWT Token
        // Make sure JWT_SECRET is in your api/.env file!
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

        // 4. Remove password from the response for security
        const { password: pass, ...rest } = validUser._doc;

        // 5. Send cookie and user data back to frontend
        res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest);

    } catch (error) {
        next(error);
    }
};