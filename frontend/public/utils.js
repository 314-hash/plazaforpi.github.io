// Format currency values
export const formatCurrency = (value, currency = 'PI') => {
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
    });
    return `${formatter.format(value)} ${currency}`;
};

// Format dates
export const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
};

// Validate ethereum address
export const isValidEthAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Format ethereum address for display
export const formatAddress = (address, start = 6, end = 4) => {
    if (!address) return '';
    return `${address.slice(0, start)}...${address.slice(-end)}`;
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
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

// Parse URL query parameters
export const parseQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
};

// Update URL query parameters
export const updateQueryParams = (params) => {
    const url = new URL(window.location);
    Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined) {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, value);
        }
    });
    window.history.pushState({}, '', url);
};

// Handle file uploads and return base64 string
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

// Validate image file
export const validateImage = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a JPEG, PNG, or GIF image.');
    }

    if (file.size > maxSize) {
        throw new Error('File size too large. Maximum size is 5MB.');
    }

    return true;
};

// Format file size
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Generate random ID
export const generateId = (length = 8) => {
    return Math.random().toString(36).substring(2, length + 2);
};

// Deep clone object
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};

// Format price range for display
export const formatPriceRange = (min, max) => {
    if (!min && !max) return 'Any price';
    if (!max) return `${formatCurrency(min)}+`;
    if (!min) return `Up to ${formatCurrency(max)}`;
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
};

// Sort listings by different criteria
export const sortListings = (listings, sortBy) => {
    const sorters = {
        'price-asc': (a, b) => parseFloat(a.price) - parseFloat(b.price),
        'price-desc': (a, b) => parseFloat(b.price) - parseFloat(a.price),
        'date-asc': (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        'date-desc': (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    };

    const sorter = sorters[sortBy] || sorters['date-desc'];
    return [...listings].sort(sorter);
};

// Filter listings by price range
export const filterListingsByPrice = (listings, minPrice, maxPrice) => {
    return listings.filter(listing => {
        const price = parseFloat(listing.price);
        if (minPrice && price < minPrice) return false;
        if (maxPrice && price > maxPrice) return false;
        return true;
    });
};

// Search listings by query
export const searchListings = (listings, query) => {
    const searchTerm = query.toLowerCase();
    return listings.filter(listing => 
        listing.title.toLowerCase().includes(searchTerm) ||
        listing.description.toLowerCase().includes(searchTerm)
    );
};

// Group listings by category
export const groupListingsByCategory = (listings) => {
    return listings.reduce((groups, listing) => {
        const category = listing.category || 'Uncategorized';
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(listing);
        return groups;
    }, {});
};
