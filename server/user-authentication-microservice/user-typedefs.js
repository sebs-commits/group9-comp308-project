import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        type: String!
        password: String
    }

    type Query {
        user(id: ID!): User
    }

    type Mutation {
        createUser(username: String!, email: String!, type: String!, password: String!): User
        updateUser(id: ID!, username: String!, email: String!, type: String!): User
        loginUser(username: String!, password: String!): [String!]!\
        logout: String
    }
`;