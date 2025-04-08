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

    type Query {
        _microservice: String
        
        events: [Events]
        userEvents(creatorId: ID!): [Events]
        event(_id: ID!): Events
    }

    type Mutation {
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
            id: ID!,
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

        deleteEvent(id: ID!): Events
    }
`;
