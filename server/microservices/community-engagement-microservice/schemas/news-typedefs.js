import { gql } from "apollo-server-express";

export const newsTypeDefs = gql`
    type News {
        _id: ID!
        creatorId: String!
        headline: String!
        summary: String!
        fullnews: String!
        creationDate: String!
        expiryDate: String!
    }

    type Query {
        allNoneExpiredNews: [News]
        news(_id: ID!): News
    }

    type Mutation {
        createNews(
            creatorId: String!,
            headline: String!,
            summary: String!,
            fullnews: String!,
            creationDate: String!,
            expiryDate: String!
        ): News

        updateNews(
            _id: ID!,
            creatorId: String!,
            headline: String!,
            summary: String!,
            fullnews: String!,
            creationDate: String!,
            expiryDate: String!
        ): News

        deleteNews(_id: ID!): News
    }
`;