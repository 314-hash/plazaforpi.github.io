import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { User } from '../models/userModel.js';

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400);
            throw new Error('Invalid input data');
        }

        const { username, email, password, walletAddress } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ 
            $or: [{ email }, { username }, { walletAddress }] 
        });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password,
            walletAddress
        });

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    walletAddress: user.walletAddress,
                    isAdmin: user.isAdmin,
                    token: generateToken(user._id)
                }
            });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400);
            throw new Error('Invalid input data');
        }

        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    walletAddress: user.walletAddress,
                    isAdmin: user.isAdmin,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('listings', 'title price status')
            .populate('orders', 'status paymentStatus');

        if (user) {
            res.json({
                success: true,
                data: user
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.bio = req.body.bio || user.bio;
            user.profileImage = req.body.profileImage || user.profileImage;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                data: {
                    _id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    walletAddress: updatedUser.walletAddress,
                    bio: updatedUser.bio,
                    profileImage: updatedUser.profileImage,
                    isAdmin: updatedUser.isAdmin,
                    token: generateToken(updatedUser._id)
                }
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};
