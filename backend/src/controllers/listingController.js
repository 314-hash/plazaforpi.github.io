import { validationResult } from 'express-validator';
import { Listing } from '../models/listingModel.js';
import { User } from '../models/userModel.js';

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
export const createListing = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400);
            throw new Error('Invalid input data');
        }

        const listing = new Listing({
            ...req.body,
            seller: req.user._id
        });

        const createdListing = await listing.save();

        // Add listing to user's listings array
        await User.findByIdAndUpdate(req.user._id, {
            $push: { listings: createdListing._id }
        });

        res.status(201).json({
            success: true,
            data: createdListing
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
export const getListings = async (req, res, next) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.page) || 1;

        const keyword = req.query.keyword
            ? {
                $or: [
                    { title: { $regex: req.query.keyword, $options: 'i' } },
                    { description: { $regex: req.query.keyword, $options: 'i' } }
                ]
            }
            : {};

        const count = await Listing.countDocuments({ ...keyword });
        const listings = await Listing.find({ ...keyword })
            .populate('seller', 'username profileImage reputation')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                listings,
                page,
                pages: Math.ceil(count / pageSize)
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate('seller', 'username profileImage reputation')
            .populate('likes', 'username');

        if (listing) {
            // Increment views
            listing.views += 1;
            await listing.save();

            res.json({
                success: true,
                data: listing
            });
        } else {
            res.status(404);
            throw new Error('Listing not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
export const updateListing = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400);
            throw new Error('Invalid input data');
        }

        const listing = await Listing.findById(req.params.id);

        if (listing) {
            if (listing.seller.toString() !== req.user._id.toString()) {
                res.status(401);
                throw new Error('Not authorized to update this listing');
            }

            const updatedListing = await Listing.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            ).populate('seller', 'username profileImage reputation');

            res.json({
                success: true,
                data: updatedListing
            });
        } else {
            res.status(404);
            throw new Error('Listing not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
export const deleteListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (listing) {
            if (listing.seller.toString() !== req.user._id.toString()) {
                res.status(401);
                throw new Error('Not authorized to delete this listing');
            }

            await listing.remove();

            // Remove listing from user's listings array
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { listings: listing._id }
            });

            res.json({
                success: true,
                message: 'Listing removed'
            });
        } else {
            res.status(404);
            throw new Error('Listing not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Like/Unlike listing
// @route   POST /api/listings/:id/like
// @access  Private
export const likeListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (listing) {
            const alreadyLiked = listing.likes.includes(req.user._id);

            if (alreadyLiked) {
                // Unlike
                listing.likes = listing.likes.filter(
                    id => id.toString() !== req.user._id.toString()
                );
            } else {
                // Like
                listing.likes.push(req.user._id);
            }

            await listing.save();

            res.json({
                success: true,
                data: {
                    likes: listing.likes.length,
                    isLiked: !alreadyLiked
                }
            });
        } else {
            res.status(404);
            throw new Error('Listing not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Search listings
// @route   GET /api/listings/search
// @access  Public
export const searchListings = async (req, res, next) => {
    try {
        const { q, category, minPrice, maxPrice, condition, sort } = req.query;
        const query = {};

        // Text search
        if (q) {
            query.$text = { $search: q };
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = minPrice;
            if (maxPrice) query.price.$lte = maxPrice;
        }

        // Condition filter
        if (condition) {
            query.condition = condition;
        }

        // Sorting
        let sortQuery = { createdAt: -1 };
        if (sort) {
            switch (sort) {
                case 'price-asc':
                    sortQuery = { price: 1 };
                    break;
                case 'price-desc':
                    sortQuery = { price: -1 };
                    break;
                case 'views':
                    sortQuery = { views: -1 };
                    break;
                case 'likes':
                    sortQuery = { 'likes.length': -1 };
                    break;
            }
        }

        const listings = await Listing.find(query)
            .populate('seller', 'username profileImage reputation')
            .sort(sortQuery);

        res.json({
            success: true,
            data: listings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get listings by category
// @route   GET /api/listings/category/:category
// @access  Public
export const getListingsByCategory = async (req, res, next) => {
    try {
        const listings = await Listing.find({ category: req.params.category })
            .populate('seller', 'username profileImage reputation')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: listings
        });
    } catch (error) {
        next(error);
    }
};
