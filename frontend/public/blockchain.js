// Contract ABIs
const MARKETPLACE_ABI = [
    // TODO: Add your marketplace contract ABI here
];

const TOKEN_ABI = [
    // TODO: Add your token contract ABI here
];

// Contract addresses (testnet)
const MARKETPLACE_ADDRESS = '0x...'; // TODO: Add your marketplace contract address
const TOKEN_ADDRESS = '0x...'; // TODO: Add your token contract address

class BlockchainService {
    constructor() {
        this.web3 = null;
        this.userAccount = null;
        this.marketplaceContract = null;
        this.tokenContract = null;
    }

    async initialize() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Initialize Web3
                this.web3 = new Web3(window.ethereum);
                
                // Initialize contracts
                this.marketplaceContract = new this.web3.eth.Contract(
                    MARKETPLACE_ABI,
                    MARKETPLACE_ADDRESS
                );
                
                this.tokenContract = new this.web3.eth.Contract(
                    TOKEN_ABI,
                    TOKEN_ADDRESS
                );

                // Setup event listeners
                this._setupEventListeners();

                return true;
            } catch (error) {
                console.error('Failed to initialize blockchain service:', error);
                return false;
            }
        }
        return false;
    }

    async connectWallet() {
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            this.userAccount = accounts[0];
            return this.userAccount;
        } catch (error) {
            console.error('User denied account access');
            throw error;
        }
    }

    async createListing(listing) {
        if (!this.userAccount) {
            throw new Error('Wallet not connected');
        }

        try {
            const listingPrice = this.web3.utils.toWei(listing.price.toString(), 'ether');
            
            // Approve marketplace to spend tokens
            await this.tokenContract.methods
                .approve(MARKETPLACE_ADDRESS, listingPrice)
                .send({ from: this.userAccount });

            // Create listing
            const result = await this.marketplaceContract.methods
                .createListing(
                    listing.title,
                    listing.description,
                    listingPrice,
                    listing.category,
                    listing.image
                )
                .send({ from: this.userAccount });

            return result;
        } catch (error) {
            console.error('Error creating listing:', error);
            throw error;
        }
    }

    async purchaseListing(listingId) {
        if (!this.userAccount) {
            throw new Error('Wallet not connected');
        }

        try {
            const listing = await this.marketplaceContract.methods
                .getListing(listingId)
                .call();

            // Purchase listing
            const result = await this.marketplaceContract.methods
                .purchaseListing(listingId)
                .send({
                    from: this.userAccount,
                    value: listing.price
                });

            return result;
        } catch (error) {
            console.error('Error purchasing listing:', error);
            throw error;
        }
    }

    async getListings(page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const listings = await this.marketplaceContract.methods
                .getListings(offset, limit)
                .call();

            return listings.map(this._formatListing);
        } catch (error) {
            console.error('Error fetching listings:', error);
            throw error;
        }
    }

    async getListingsByCategory(category, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const listings = await this.marketplaceContract.methods
                .getListingsByCategory(category, offset, limit)
                .call();

            return listings.map(this._formatListing);
        } catch (error) {
            console.error('Error fetching listings by category:', error);
            throw error;
        }
    }

    async searchListings(query, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const listings = await this.marketplaceContract.methods
                .searchListings(query, offset, limit)
                .call();

            return listings.map(this._formatListing);
        } catch (error) {
            console.error('Error searching listings:', error);
            throw error;
        }
    }

    async getUserListings() {
        if (!this.userAccount) {
            throw new Error('Wallet not connected');
        }

        try {
            const listings = await this.marketplaceContract.methods
                .getUserListings(this.userAccount)
                .call();

            return listings.map(this._formatListing);
        } catch (error) {
            console.error('Error fetching user listings:', error);
            throw error;
        }
    }

    _formatListing(listing) {
        return {
            id: listing.id,
            seller: listing.seller,
            title: listing.title,
            description: listing.description,
            price: Web3.utils.fromWei(listing.price, 'ether'),
            category: listing.category,
            image: listing.image,
            active: listing.active,
            createdAt: new Date(listing.createdAt * 1000)
        };
    }

    _setupEventListeners() {
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
            this.userAccount = accounts[0];
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('walletChanged', {
                detail: { account: this.userAccount }
            }));
        });

        // Listen for network changes
        window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
        });

        // Listen for new listings
        this.marketplaceContract.events.ListingCreated()
            .on('data', (event) => {
                window.dispatchEvent(new CustomEvent('listingCreated', {
                    detail: { listing: this._formatListing(event.returnValues) }
                }));
            });

        // Listen for purchases
        this.marketplaceContract.events.ListingPurchased()
            .on('data', (event) => {
                window.dispatchEvent(new CustomEvent('listingPurchased', {
                    detail: { 
                        listingId: event.returnValues.listingId,
                        buyer: event.returnValues.buyer
                    }
                }));
            });
    }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
