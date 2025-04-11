import { gql } from 'apollo-server-express';


//NOTE: input NumberAndStringTupleInput was suggested by copilot on 2025-04-10 after prompt 'how to make reviews and Number and string tuple'


export const businessListingTypeDefs = gql`
    type BusinessListing {
        id: ID!
        listingTicketId: String!
        businessName: String!
        address: String!
        phoneNumber: String!
        businessDescription: String!
        images: [String]
        discounts: String
        reviews: [String]    
    }

    extend type Query {
        listings: [BusinessListing]
        listing(listingTicketId: String!): BusinessListing
    }

    extend type Mutation {
        createBusinessListing(
            listingTicketId: String!,
            businessName: String!,
            address: String!,
            phoneNumber: String!,
            businessDescription: String!,
            images: [String],
            discounts: String,
            reviews: [String]   
        ): BusinessListing

        updateBusinessListing(
            listingTicketId: String!,
            businessName: String!,
            address: String!,
            phoneNumber: String!,
            businessDescription: String!,
            images: [String],
            discounts: String,
            reviews: [String]      
        ): BusinessListing

        deleteBusinessListing(listingTicketId: String!): BusinessListing
    }
`;

export default businessListingTypeDefs;