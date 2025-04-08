import BusinessListingModel from "../models/business-listing.server.model.js";

export const businessListingResolvers = {
    Query: {
        listings: async () => {
            try {
                const listings = await BusinessListingModel.find();
                return listings;
            } catch(error) {
                console.error(`An error occurred while fetching business listings`, error);
                throw new Error("Error in business listing query - business-listing.server.resolver.js");
            }
        },

        //copilot suggested this code, but I had to modify it. Modds include: changing _id to listingTicketId,
        // changing the Model name, and changing the error messages on 2025-04-02 for prompt: 'do lines 14-21 fetch a listing by the ticketId properly?'.
        listing: async (_, { listingTicketId }) => {
            const listing = await BusinessListingModel.findOne({ listingTicketId });

            if(!listing) {
                throw new Error("You are trying to fetch a business listing that does not exist in the database.");
            }
            return listing;
        },
        //end of copilot suggestion
    },
    
    Mutation: {
        createBusinessListing: async (_, { listingTicketId, businessName, address, phoneNumber, businessDescription, images, discounts }) => {    
            const newbusinessListing = new BusinessListingModel({
                listingTicketId, businessName, address, phoneNumber, businessDescription, images, discounts
            });
            return await newbusinessListing.save();
        },
        updateBusinessListing: async (_, { listingTicketId, businessName, address, phoneNumber, businessDescription, images, discounts }) => {
            const existingBusinessListing = await BusinessListingModel.findOne({ listingTicketId });
            if (!existingBusinessListing) {
                throw new Error("Error, this businness listing doesn't exist in the DB.");
            }

            const existingListingTicketId = existingBusinessListing._id;
            return await BusinessListingModel.findByIdAndUpdate(existingListingTicketId, {
                businessName, address, phoneNumber, businessDescription, images, discounts}, { new: true });
        },
        deleteBusinnessListing: async (_, { listingTicketId }) => {
            const existingBusinessListing = await BusinessListingModel.findOne({ listingTicketId });
            if (!existingBusinessListing) {
                throw new Error("Error, this businness listing doesn't exist in the DB.");
            }
            const existingListingTicketId = existingBusinessListing._id;
            return await BusinessListingModel.findByIdAndDelete(existingListingTicketId);
        }
    }
};