import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const generateToken = (userId, role) => {
  return jwt.sign({
      userId,
      role
    },
    process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      phone,
      company,
      city,
      profileImage
    } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: 'Name, email, password, and confirmation are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      email
    });
    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists'
      });
    }

    // Broker-specific validation
    if (role === 'broker') {
      if (!phone || !company || !city) {
        return res.status(400).json({
          message: 'Phone, company, and city are required for broker registration'
        });
      }
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    console.log('Registration data received:', {
      name,
      email,
      role,
      hasProfileImage: !!profileImage,
      profileImage: profileImage
    });

    // Create user object with role-specific fields
    const userData = {
      name,
      email,
      password,
      role: role || 'client',
      verificationToken,
      isVerified: false,
      ...(profileImage && {
        profileImage
      }),
    };

    // Add broker-specific fields
    if (role === 'broker') {
      userData.phone = phone;
      userData.company = company;
      userData.city = city;
      userData.isBrokerVerified = false; // Requires admin approval
    } else if (role === 'client') {
      userData.phone = phone || null;
    }

    // Create user
    const user = new User(userData);
    await user.save();

    console.log('User registered successfully:', {
      userId: user._id,
      email: user.email
    });

    res.status(201).json({
      message: role === 'broker' ?
        'Broker account created successfully. Please check your email to verify your account. Admin verification is required to list properties.' : 'User registered successfully. Please check your email to verify your account.',
      userId: user._id,
    });
  } catch (error) {
    console.error('Registration error:', error);
  };
}

export const login = async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Find user and select password
    const user = await User.findOne({
      email
    }).select('+password');
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Check if broker is verified by admin
    if (user.role === 'broker' && !user.isBrokerVerified) {
      return res.status(403).json({
        message: 'Your broker account is pending admin approval. Please wait for verification.',
        userId: user._id,
      });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const {
      token
    } = req.params;

    if (!token) {
      return res.status(400).json({
        message: 'Verification token is required'
      });
    }

    const user = await User.findOne({
      verificationToken: token
    });
    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired verification token'
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({
      message: 'Email verified successfully. You can now log in.'
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).populate('city', 'name');
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const responseUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      company: user.company,
      profileImage: user.profileImage,
    };

    // Add broker-specific fields if broker
    if (user.role === 'broker') {
      responseUser.city = user.city.name;
      responseUser.isBrokerVerified = user.isBrokerVerified;
    }

    res.json({
      user: responseUser
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      company,
      profileImage
    } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Update user fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (company) user.company = company;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        company: user.company,
        profileImage: user.profileImage,
        ...(user.role === 'broker' && {
          city: user.city,
          isBrokerVerified: user.isBrokerVerified,
        }),
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    next(error);
  }
};