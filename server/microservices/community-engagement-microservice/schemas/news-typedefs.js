import { gql } from "apollo-server-express";

export const newsTypeDefs = gql`
  type News {
    _id: ID!
    creatorId: String!
    headline: String!
    textBody: String!
    creationDate: String!
  }

  type Query {
    allNews: [News]
    news(_id: ID!): News
  }

  type Mutation {
    createNews(creatorId: String!, headline: String!, textBody: String!): News

    updateNews(
      _id: ID!
      creatorId: String!
      headline: String!
      textBody: String!
    ): News

    deleteNews(_id: ID!): News
  }
`;
