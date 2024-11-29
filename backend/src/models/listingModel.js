import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    price: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Electronics', 'Fashion', 'Home', 'Sports', 'Art', 'Books', 'Other']
    },
    images: [{
        type: String,
        required: true
    }],
    condition: {
        type: String,
        required: true,
        enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
    },
    status: {
        type: String,
        enum: ['active', 'sold', 'cancelled'],
        default: 'active'
    },
    tags: [{
        type: String,
        trim: true
    }],
    location: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    transactionHash: {
        type: String
    },
    contractAddress: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Add text index for search functionality
listingSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Listing = mongoose.model('Listing', listingSchema);
