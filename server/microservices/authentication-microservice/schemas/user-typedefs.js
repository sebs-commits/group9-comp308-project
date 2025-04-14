import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        type: String!
        password: String!
        interests: String
        location: String
        eventMatches: String
        requestMatches: String
        ignoredMatches: String
    }

    type Query {
        _microservice: String

        users: [User]
        user(id: ID!): User
        getUserByUsername(username: String!): String
    }

    type Mutation {
        createUser(username: String!, email: String!, type: String!, password: String!): User
        updateUser(id: ID!, username: String!, email: String!, type: String!): User
        loginUser(username: String!, password: String!): [String!]!\
        logout: String
        updateVolunteer(id: ID!, interests: String!, location: String!, eventMatches: String!, requestMatches: String!, ignoredMatches: String!): User
    }
`;