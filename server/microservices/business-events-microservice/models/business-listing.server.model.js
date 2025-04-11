import mongoose from "mongoose";

const { Schema } = mongoose;

const businessListingSchema = new Schema({
    listingTicketId: { type: String, required: true, unique: true },
    
    businessName: { type: String, required: true },

    address : { type: String, required: true },

    phoneNumber: { type: String, required: true },

    businessDescription: { type: String, required: true },

    images: {type: [String], default: [] }, // Store multiple images as an array of base64 strings

    discounts: { type: String, required: false },
    
    reviews: { type: [String], required: false },
})

const BusinessListingModel = mongoose.model('BusinessListing', businessListingSchema);

export default BusinessListingModel;