import { gql } from "apollo-server-express";

export const aiTypeDefs = gql`
    type Query {
        _microservice: String

        requestAssistance(prompt: String!): String
    }
`;
