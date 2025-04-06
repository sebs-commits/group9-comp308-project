import { gql } from "apollo-server-express";

export const combinedTypeDefs = gql`
  type News {
    _id: ID!
    creatorId: String!
    headline: String!
    summary: String!
    fullnews: String!
    creationDate: String!
    expiryDate: String!
  }

  type Requests {
    id: ID!
    creatorId: String!
    title: String!
    type: String!
    request: String!
  }

  type Alert {
    id: ID!
    creatorId: String!
    title: String!
    subtitle: String!
  }

  type Discussion {
    _id: ID!
    title: String!
    description: String!
    createdAt: String!
  }

  type Query {
    _microservice: String

    allNoneExpiredNews: [News]
    news(_id: ID!): News

    requests: [Requests]
    request(_id: ID!): Requests

    alerts: [Alert]
    alert(_id: ID!): Alert

    discussions: [Discussion]
    discussion(_id: ID!): Discussion
  }

  type Mutation {
    createNews(
      creatorId: String!
      headline: String!
      summary: String!
      fullnews: String!
      creationDate: String!
      expiryDate: String!
    ): News

    updateNews(
      _id: ID!
      creatorId: String!
      headline: String!
      summary: String!
      fullnews: String!
      creationDate: String!
      expiryDate: String!
    ): News

    deleteNews(_id: ID!): News

    createRequest(
      creatorId: String!
      title: String!
      type: String!
      request: String!
    ): Requests

    updateRequest(
      _id: ID!
      creatorId: String!
      title: String!
      type: String!
      request: String!
    ): Requests

    deleteRequest(_id: ID!): Requests

    createAlert(creatorId: String!, title: String!, subtitle: String!): Alert

    updateAlert(
      _id: ID!
      creatorId: String!
      title: String!
      subtitle: String!
    ): Alert

    deleteAlert(_id: ID!): Alert

    createDiscussion(title: String!, description: String!): Discussion

    updateDiscussion(_id: ID!, title: String!, description: String!): Discussion

    deleteDiscussion(_id: ID!): Discussion
  }
`;
