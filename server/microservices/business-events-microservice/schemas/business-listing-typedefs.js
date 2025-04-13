import { gql } from 'apollo-server-express';

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
        creatorUsername: String!
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
            creatorUsername: String!
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
            creatorUsername: String!
        ): BusinessListing

        deleteBusinessListing(listingTicketId: String!): BusinessListing
    }
`;

export default businessListingTypeDefs;