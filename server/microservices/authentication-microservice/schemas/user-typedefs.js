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
        participation: String
    }

    type Query {
        _microservice: String

        user(id: String!): User
    }

    type Mutation {
        createUser(username: String!, email: String!, type: String!, password: String!): User
        updateUser(id: ID!, username: String!, email: String!, type: String!): User
        loginUser(username: String!, password: String!): [String!]!\
        logout: String
        updateVolunteer(id: ID!, interests: String!, location: String!, participation: String!): User
    }
`;