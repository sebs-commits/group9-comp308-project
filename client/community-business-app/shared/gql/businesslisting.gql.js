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
        }
    }
`;

export const CREATE_BUSINESS_LISTING = gql`
    mutation CreateBusinessListing($listingTicketId: String!, $businessName: String!, $address: String!, $phoneNumber: String!, $businessDescription: String!, $images: [String], $discounts: String!) {
        createBusinessListing(listingTicketId: $listingTicketId, businessName: $businessName, address: $address, phoneNumber: $phoneNumber, businessDescription: $businessDescription, images: $images, discounts: $discounts) {
            listingTicketId
            businessName
            address
            phoneNumber
            businessDescription
            images
            discounts
        }
    }
`;


export const UPDATE_BUSINESS_LISTING = gql`
    mutation UpdateBusinessListing($listingTicketId: String!, $businessName: String!, $address: String!, $phoneNumber: String!, $businessDescription: String!, $images: [String], $discounts: String!) {
        updateBusinessListing(listingTicketId: $listingTicketId, businessName: $businessName, address: $address, phoneNumber: $phoneNumber, businessDescription: $businessDescription, images: $images, discounts: $discounts) {
            id    
            listingTicketId
            businessName
            address
            phoneNumber
            businessDescription
            images
            discounts
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
        }
    }
`;