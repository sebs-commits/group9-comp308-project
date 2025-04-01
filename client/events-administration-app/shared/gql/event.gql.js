import { gql } from "@apollo/client";

export const CREATE_EVENT = gql`
    mutation CreateEvent($creatorId: String!, $title: String!, $description: String!, $summary: String!, $type: String!, $from: String!, $to: String!, $price: String!, $location: String!) {
        createEvent(creatorId: $creatorId, title: $title, description: $description, summary: $summary, type: $type, from: $from, to: $to, price: $price, location: $location) {
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