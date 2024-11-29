import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import {
    createListing,
    getListings,
    getListing,
    updateListing,
    deleteListing,
    likeListing,
    searchListings,
    getListingsByCategory
} from '../controllers/listingController.js';

const router = express.Router();

// Validation middleware
const listingValidation = [
    body('title').trim().isLength({ min: 3, max: 100 }).escape(),
    body('description').trim().isLength({ min: 10, max: 2000 }).escape(),
    body('price').isNumeric(),
    body('category').isIn(['Electronics', 'Fashion', 'Home', 'Sports', 'Art', 'Books', 'Other']),
    body('condition').isIn(['New', 'Like New', 'Good', 'Fair', 'Poor']),
    body('location').trim().notEmpty(),
    body('contractAddress').matches(/^0x[a-fA-F0-9]{40}$/)
];

// Routes
router.route('/')
    .post(protect, listingValidation, createListing)
    .get(getListings);

router.get('/search', searchListings);
router.get('/category/:category', getListingsByCategory);

router.route('/:id')
    .get(getListing)
    .put(protect, listingValidation, updateListing)
    .delete(protect, deleteListing);

router.post('/:id/like', protect, likeListing);

export default router;
