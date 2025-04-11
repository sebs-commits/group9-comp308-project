import { gql } from '@apollo/client';

export const GET_BUSINESS_LISTING = gql`
    query GetBusinessListing($listingTicketId: String!) {
        listing(listingTicketId: $listingTicketId) {
            id
            listingTicketId
            businessName
            address
            phoneNumber
            businessDescription
            images
            discounts
            reviews
        } 
    }
`;


export const GET_BUSINESS_LISTINGS = gql`
    query GetBusinessListings {
        listings {
            id
            listingTicketId
            businessName
            address
            phoneNumber
            businessDescription
            images
            discounts
            reviews
        }
    }
`;

export const CREATE_BUSINESS_LISTING = gql`
    mutation CreateBusinessListing($listingTicketId: String!, $businessName: String!, $address: String!, $phoneNumber: String!, $businessDescription: String!, $images: [String], $discounts: String, $reviews: [String]) {
        createBusinessListing(listingTicketId: $listingTicketId, businessName: $businessName, address: $address, phoneNumber: $phoneNumber, businessDescription: $businessDescription, images: $images, discounts: $discounts, reviews: $reviews) {
            listingTicketId
            businessName
            address
            phoneNumber
            businessDescription
            images
            discounts
            reviews
        }
    }
`;


export const UPDATE_BUSINESS_LISTING = gql`
    mutation UpdateBusinessListing($listingTicketId: String!, $businessName: String!, $address: String!, $phoneNumber: String!, $businessDescription: String!, $images: [String], $discounts: String, $reviews: [String]) {
        updateBusinessListing(listingTicketId: $listingTicketId, businessName: $businessName, address: $address, phoneNumber: $phoneNumber, businessDescription: $businessDescription, images: $images, discounts: $discounts, reviews: $reviews) {
            id    
            listingTicketId
            businessName
            address
            phoneNumber
            businessDescription
            images
            discounts
            reviews
        }
    }
`;

export const DELETE_BUSINESS_LISTING = gql`
    mutation DeleteBusinessListing($listingTicketId: String!) {
        deleteBusinessListing(listingTicketId: $listingTicketId) {
            id
            listingTicketId
            businessName
            address
            phoneNumber
            businessDescription
            images
            discounts
            reviews
        }
    }
`;