// Utility Functions
const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
};

const validateListing = (listing) => {
    const errors = [];
    
    if (!listing.title || listing.title.length < 3) {
        errors.push('Title must be at least 3 characters long');
    }
    
    if (!listing.description || listing.description.length < 10) {
        errors.push('Description must be at least 10 characters long');
    }
    
    if (!listing.price || isNaN(listing.price) || listing.price <= 0) {
        errors.push('Price must be a positive number');
    }
    
    if (!listing.image) {
        errors.push('Image is required');
    }
    
    return errors;
};

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const showError = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
};

const showSuccess = (message) => {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
};

// Export functions
window.utils = {
    formatAddress,
    formatPrice,
    validateListing,
    debounce,
    showError,
    showSuccess
};
