import { gql } from "@apollo/client";

export const CREATE_EVENT = gql`
    mutation CreateEvent($creatorId: String!, $title: String!, $description: String!, $summary: String!, $type: String!, $from: String!, $to: String!, $price: String!, $location: String!) {
        createEvent(creatorId: $creatorId, title: $title, description: $description, summary: $summary, type: $type, from: $from, to: $to, price: $price, location: $location) {
            id
            creatorId
            title
            description
            summary
            type
            from
            to
            price
            location
        }
    }
`;

export const UPDATE_EVENT = gql`
    mutation UpdateEvent($id: ID!, $creatorId: String!, $title: String!, $description: String!, $summary: String!, $type: String!, $from: String!, $to: String!, $price: String!, $location: String!) {
        updateEvent(id: $id, creatorId: $creatorId, title: $title, description: $description, summary: $summary, type: $type, from: $from, to: $to, price: $price, location: $location) {
            id
            creatorId
            title
            description
            summary
            type
            from
            to
            price
            location
        }
    }
`;

export const DELETE_EVENT = gql`
 mutation DeleteEvent($id: ID!) {
        deleteEvent(id: $id) {
            id
            creatorId
            title
            description
            summary
            type
            from
            to
            price
            location
        }
    }   
`;

export const GET_NON_EXPIRED_EVENTS = gql`
    query Events{
        events {
            id
            title
            description
            summary
            type
            from
            to
            price
            location
        }
    }
`;

export const GET_YOUR_EVENTS = gql`
    query UserEvents($creatorId: ID!){
        userEvents(creatorId: $creatorId) {
            id
            creatorId
            title
            description
            summary
            type
            from
            to
            price
            location
        }
    }
`;

export const GET_EVENT = gql`
    query Event($id: ID!) {
        event(_id: $id) {
            id
            creatorId
            title
            description
            summary
            type
            from
            to
            price
            location
        }
    }
`;