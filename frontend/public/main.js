// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const setTheme = (isDark) => {
    body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

// Initialize theme from localStorage or system preference
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme === 'dark');
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark);
    }
};

themeToggle?.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';
    setTheme(!isDark);
});

// Modal Management
const modals = document.querySelectorAll('.modal');
const modalTriggers = document.querySelectorAll('[data-modal-target]');
const modalCloseButtons = document.querySelectorAll('[data-modal-close]');

const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        body.style.overflow = 'hidden';
    }
};

const closeModal = (modal) => {
    modal.classList.remove('active');
    body.style.overflow = '';
};

modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const modalId = trigger.getAttribute('data-modal-target');
        openModal(modalId);
    });
});

modalCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal);
    });
});

modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
});

// Category Management
const categoryItems = document.querySelectorAll('.category-item');

categoryItems.forEach(item => {
    item.addEventListener('click', () => {
        categoryItems.forEach(cat => cat.classList.remove('active'));
        item.classList.add('active');
        // TODO: Implement category filtering
    });
});

// Wallet Connection
let web3;
let userAccount;

const connectWalletButton = document.getElementById('connect-wallet');
const walletAddress = document.getElementById('wallet-address');

const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            
            // Update UI
            if (connectWalletButton && walletAddress) {
                connectWalletButton.style.display = 'none';
                walletAddress.textContent = `${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`;
                walletAddress.style.display = 'block';
            }

            // Initialize Web3
            web3 = new Web3(window.ethereum);

            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts) => {
                userAccount = accounts[0];
                if (walletAddress) {
                    walletAddress.textContent = `${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`;
                }
            });

        } catch (error) {
            console.error('User denied account access:', error);
        }
    } else {
        console.error('Please install MetaMask!');
        // TODO: Show user-friendly error message
    }
};

connectWalletButton?.addEventListener('click', connectWallet);

// Listing Management
const createListingForm = document.getElementById('create-listing-form');

createListingForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!userAccount) {
        alert('Please connect your wallet first!');
        return;
    }

    const formData = new FormData(e.target);
    const listing = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: formData.get('price'),
        category: formData.get('category'),
        image: formData.get('image')
    };

    try {
        // TODO: Implement contract interaction for listing creation
        console.log('Creating listing:', listing);
        
        // Show success message
        alert('Listing created successfully!');
        
        // Close modal and reset form
        const modal = createListingForm.closest('.modal');
        closeModal(modal);
        createListingForm.reset();
        
    } catch (error) {
        console.error('Error creating listing:', error);
        alert('Error creating listing. Please try again.');
    }
});

// Search Functionality
const searchForm = document.querySelector('.search-bar');
const searchInput = document.querySelector('.search-bar input');

searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        // TODO: Implement search functionality
        console.log('Searching for:', searchTerm);
    }
});

// Price Range Filter
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');

const handlePriceFilter = () => {
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
    
    // TODO: Implement price filtering
    console.log('Price range:', { minPrice, maxPrice });
};

minPriceInput?.addEventListener('change', handlePriceFilter);
maxPriceInput?.addEventListener('change', handlePriceFilter);

// Sort Functionality
const sortSelect = document.getElementById('sort-by');

sortSelect?.addEventListener('change', (e) => {
    const sortValue = e.target.value;
    // TODO: Implement sorting
    console.log('Sorting by:', sortValue);
});

// Pagination
const paginationButtons = document.querySelectorAll('.pagination button');

paginationButtons.forEach(button => {
    button.addEventListener('click', () => {
        const page = button.getAttribute('data-page');
        // TODO: Implement pagination
        console.log('Navigate to page:', page);
        
        paginationButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    // TODO: Load initial listings
});
