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

// Initialize theme
initTheme();

// Wallet Connection
const connectWalletBtn = document.getElementById('connectWallet');
let userWallet = null;

const connectWallet = async () => {
    try {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userWallet = accounts[0];
            
            // Update button text
            connectWalletBtn.textContent = `${userWallet.slice(0, 6)}...${userWallet.slice(-4)}`;
            
            // Initialize blockchain service
            initBlockchainService();
            
            // Load user's listings
            loadUserListings();
        } else {
            alert('Please install MetaMask to use this marketplace!');
        }
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
    }
};

connectWalletBtn?.addEventListener('click', connectWallet);

// Transaction Progress
const transactionModal = document.getElementById('transactionModal');
const stepProgress = document.getElementById('stepProgress');
const transactionStatus = document.getElementById('transactionStatus');

const showTransactionProgress = (step, total) => {
    transactionModal.style.display = 'block';
    const progress = (step / total) * 100;
    stepProgress.style.width = `${progress}%`;
    
    switch(step) {
        case 1:
            transactionStatus.textContent = 'Initiating transaction...';
            break;
        case 2:
            transactionStatus.textContent = 'Waiting for confirmation...';
            break;
        case 3:
            transactionStatus.textContent = 'Transaction confirmed!';
            setTimeout(() => {
                transactionModal.style.display = 'none';
            }, 2000);
            break;
    }
};

// Listings Grid
const listingsGrid = document.getElementById('listingsGrid');

const createListingCard = (listing) => {
    const card = document.createElement('div');
    card.className = 'listing-card';
    card.innerHTML = `
        <img src="${listing.image}" alt="${listing.title}">
        <div class="listing-content">
            <h3>${listing.title}</h3>
            <p>${listing.description}</p>
            <div class="listing-footer">
                <span class="price">${listing.price} π</span>
                <button class="btn btn-primary" onclick="purchaseListing('${listing.id}')">
                    Purchase
                </button>
            </div>
        </div>
    `;
    return card;
};

const loadListings = async () => {
    try {
        // TODO: Replace with actual API call
        const listings = [
            {
                id: '1',
                title: 'Sample Item 1',
                description: 'This is a sample item',
                price: '10',
                image: 'https://via.placeholder.com/300'
            },
            // Add more sample listings
        ];
        
        listingsGrid.innerHTML = '';
        listings.forEach(listing => {
            listingsGrid.appendChild(createListingCard(listing));
        });
    } catch (error) {
        console.error('Error loading listings:', error);
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadListings();
});
