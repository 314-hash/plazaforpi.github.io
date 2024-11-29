// Blockchain Service
let provider;
let signer;
let marketplaceContract;

const MARKETPLACE_ADDRESS = '0x...'; // TODO: Replace with actual contract address
const MARKETPLACE_ABI = []; // TODO: Replace with actual contract ABI

const initBlockchainService = async () => {
    try {
        // Initialize ethers provider
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        
        // Initialize contract
        marketplaceContract = new ethers.Contract(
            MARKETPLACE_ADDRESS,
            MARKETPLACE_ABI,
            signer
        );
        
        console.log('Blockchain service initialized');
    } catch (error) {
        console.error('Error initializing blockchain service:', error);
        throw error;
    }
};

// Contract Interactions
const createListing = async (listing) => {
    try {
        const tx = await marketplaceContract.createListing(
            listing.title,
            listing.description,
            ethers.utils.parseEther(listing.price.toString()),
            listing.image
        );
        
        showTransactionProgress(1, 3);
        
        const receipt = await tx.wait();
        showTransactionProgress(2, 3);
        
        if (receipt.status === 1) {
            showTransactionProgress(3, 3);
            return receipt;
        } else {
            throw new Error('Transaction failed');
        }
    } catch (error) {
        console.error('Error creating listing:', error);
        throw error;
    }
};

const purchaseListing = async (listingId) => {
    try {
        const listing = await marketplaceContract.listings(listingId);
        const price = listing.price;
        
        const tx = await marketplaceContract.purchaseListing(listingId, {
            value: price
        });
        
        showTransactionProgress(1, 3);
        
        const receipt = await tx.wait();
        showTransactionProgress(2, 3);
        
        if (receipt.status === 1) {
            showTransactionProgress(3, 3);
            return receipt;
        } else {
            throw new Error('Transaction failed');
        }
    } catch (error) {
        console.error('Error purchasing listing:', error);
        throw error;
    }
};

const getUserListings = async (userAddress) => {
    try {
        const listings = await marketplaceContract.getUserListings(userAddress);
        return listings.map(listing => ({
            id: listing.id.toString(),
            title: listing.title,
            description: listing.description,
            price: ethers.utils.formatEther(listing.price),
            seller: listing.seller,
            image: listing.image,
            sold: listing.sold
        }));
    } catch (error) {
        console.error('Error getting user listings:', error);
        throw error;
    }
};

// Export functions
window.createListing = createListing;
window.purchaseListing = purchaseListing;
window.getUserListings = getUserListings;
window.initBlockchainService = initBlockchainService;
