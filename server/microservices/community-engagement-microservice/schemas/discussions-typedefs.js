import { gql } from "apollo-server-express";

export const discussionsTypeDefs = gql`
  type Discussion {
    _id: ID!
    title: String!
    description: String!
    createdAt: String!
  }

  type Query {
    discussions: [Discussion]
    discussion(_id: ID!): Discussion
  }

  type Mutation {
    createDiscussion(title: String!, description: String!): Discussion

    updateDiscussion(_id: ID!, title: String!, description: String!): Discussion

    deleteDiscussion(_id: ID!): Discussion
  }
`;
