import { gql } from "apollo-server-express";

export const eventTypeDefs = gql`
    input LocationInput {
        streetNumb: Int!
        streetType: String!
        streetName: String!
        city: String!
    }

    input OrganizerInput {
        organizerId: String!
        name: String!
        phoneNumber: String!
        email: String!
    }

    type Location {
        streetNumb: Int!
        streetType: String!
        streetName: String!
        city: String!
    }

    type Organizer {
        organizerId: String!
        name: String!
        phoneNumber: String!
        email: String!
    }

    type Events {
        id: ID!
        title: String!
        description: String!
        summary: String!
        type: String!
        from: String!
        to: String
        price: Float
        location: Location
        organizer: Organizer
    }

    type Query {
        events: [Events]
        event(_id: ID!): Events
    }

    type Mutation {
        createEvent(
            title: String!,
            description: String!,
            summary: String!,
            type: String!,
            from: String!,
            to: String,
            price: Float,
            location: LocationInput,
            organizer: OrganizerInput
        ): Events

        updateEvent(
            _id: ID!,
            title: String!,
            description: String!,
            summary: String!,
            type: String!,
            from: String!
        ): Events

        deleteEvent(_id: ID!): Events
    }
`;
