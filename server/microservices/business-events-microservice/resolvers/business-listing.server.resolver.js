import BusinessListingModel from "../models/business-listing.server.model.js";

export const businessListingResolvers = {
    Query: {
        listings: async () => {
            try {
                const listings = await BusinessListingModel.find();
                return listings || [];
            } catch(error) {
                console.error(`An error occurred while fetching business listings`, error);
                throw new Error("Error in business listing query - business-listing.server.resolver.js");
            }
        },

        listing: async (_, { listingTicketId }) => {
            const listing = await BusinessListingModel.findOne({ listingTicketId });

            if(!listing) {
                throw new Error("You are trying to fetch a business listing that does not exist in the database.");
            }
            return listing;
        },
    },
    
    Mutation: {
        createBusinessListing: async (_, { listingTicketId, businessName, address, phoneNumber, businessDescription, images, discounts, reviews }) => {    
            const newbusinessListing = new BusinessListingModel({
                listingTicketId, businessName, address, phoneNumber, businessDescription, images, discounts, reviews
            });
            return await newbusinessListing.save();
        },
        updateBusinessListing: async (_, { listingTicketId, businessName, address, phoneNumber, businessDescription, images, discounts, reviews }) => {
            const existingBusinessListing = await BusinessListingModel.findOne({ listingTicketId });
            if (!existingBusinessListing) {
                throw new Error("Error, this businness listing doesn't exist in the DB.");
            }

            const existingListingTicketId = existingBusinessListing._id;
            return await BusinessListingModel.findByIdAndUpdate(existingListingTicketId, {
                businessName, address, phoneNumber, businessDescription, images, discounts, reviews}, { new: true });
        },
        deleteBusinessListing: async (_, { listingTicketId }) => {
            const existingBusinessListing = await BusinessListingModel.findOne({ listingTicketId });
            if (!existingBusinessListing) {
                throw new Error("Error, this businness listing doesn't exist in the DB.");
            }
            const existingListingTicketId = existingBusinessListing._id;
            return await BusinessListingModel.findByIdAndDelete(existingListingTicketId);
        }
    }
};