import { gql } from "apollo-server-express";

export const combinedTypeDefs = gql`
  type News {
    _id: ID!
    creatorId: String!
    headline: String!
    textBody: String!
    creationDate: String!
    image: String
  }

  type Requests {
    id: ID!
    creatorId: String!
    title: String!
    type: String!
    request: String!
    location: String!
    status: String!
  }

  type Alert {
    id: ID!
    creatorId: String!
    title: String!
    subtitle: String!
    createdAt: String!
  }

  type Reply {
    _id: ID!
    creatorId: String!
    text: String!
    createdAt: String!
  }

  type Discussion {
    _id: ID!
    title: String!
    description: String!
    creatorId: String!
    newsId: ID
    createdAt: String!
    replies: [Reply!]
  }

  type Query {
    _microservice: String
    allNews: [News]
    news(_id: ID!): News

    requests: [Requests]
    request(_id: ID!): Requests
    alerts: [Alert]
    alert(_id: ID!): Alert
    discussions: [Discussion]
    discussion(_id: ID!): Discussion
    discussionsByNewsId(newsId: ID!): [Discussion]
  }

  type Mutation {
    createNews(
      creatorId: String!
      headline: String!
      textBody: String!
      image: String
    ): News
    updateNews(
      _id: ID!
      creatorId: String!
      headline: String!
      textBody: String!
      image: String
    ): News
    deleteNews(_id: ID!): News

    createRequest(
      creatorId: String!
      title: String!
      type: String!
      request: String!
      location: String!
      status: String
    ): Requests
    updateRequest(
      _id: ID!
      creatorId: String!
      title: String!
      type: String!
      request: String!
      location: String!
      status: String
    ): Requests
    deleteRequest(_id: ID!): Requests
    createAlert(
      creatorId: String!
      title: String!
      subtitle: String!
      createdAt: String!
    ): Alert
    updateAlert(
      _id: ID!
      creatorId: String!
      title: String!
      subtitle: String!
      createdAt: String!
    ): Alert
    deleteAlert(_id: ID!): Alert
    createDiscussion(
      title: String!
      description: String!
      creatorId: String!
      newsId: ID
    ): Discussion
    updateDiscussion(_id: ID!, title: String!, description: String!): Discussion
    deleteDiscussion(_id: ID!): Discussion
    addReplyToDiscussion(
      discussionId: ID!
      creatorId: String!
      text: String!
    ): Discussion
  }
`;
