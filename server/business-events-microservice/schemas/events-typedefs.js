import { gql } from "apollo-server-express";

export const eventTypeDefs = gql`
    type Events {
        id: ID!
        creatorId: String!
        title: String!
        description: String!
        summary: String!
        type: String!
        from: String!
        to: String!
        price: String!
        location: String!        
    }

    extend type Query {
        events: [Events]
        event(_id: ID!): Events
    }

    extend type Mutation {
        createEvent(
            creatorId: String!,
            title: String!,
            description: String!,
            summary: String!,
            type: String!,
            from: String!,
            to: String!,
            price: String!,
            location: String!     
        ): Events

        updateEvent(
            _id: ID!,
            creatorId: String!,
            title: String!,
            description: String!,
            summary: String!,
            type: String!,
            from: String!,
            to: String!,
            price: String!,
            location: String!            
        ): Events

        deleteEvent(_id: ID!): Events
    }
`;
