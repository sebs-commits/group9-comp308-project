import { gql } from "@apollo/client";

export const CREATE_NEWS = gql`
  mutation CreateNews(
    $creatorId: String!
    $headline: String!
    $textBody: String!
    $image: String
  ) {
    createNews(
      creatorId: $creatorId
      headline: $headline
      textBody: $textBody
      image: $image
    ) {
      _id
      creatorId
      headline
      textBody
      creationDate
      image
    }
  }
`;

export const UPDATE_NEWS = gql`
  mutation UpdateNews(
    $_id: ID!
    $creatorId: String!
    $headline: String!
    $textBody: String!
    $image: String
  ) {
    updateNews(
      _id: $_id
      creatorId: $creatorId
      headline: $headline
      textBody: $textBody
      image: $image
    ) {
      _id
      creatorId
      headline
      textBody
      creationDate
      image
    }
  }
`;

export const DELETE_NEWS = gql`
  mutation DeleteNews($_id: ID!) {
    deleteNews(_id: $_id) {
      _id
    }
  }
`;

export const GET_ALL_NEWS = gql`
  query AllNews {
    allNews {
      _id
      creatorId
      headline
      textBody
      creationDate
      image
    }
  }
`;

export const GET_NEWS = gql`
  query GetNews($_id: ID!) {
    news(_id: $_id) {
      _id
      creatorId
      headline
      textBody
      creationDate
      image
    }
  }
`;

export const GET_USER_NEWS = gql`
  query UserNews($creatorId: String!) {
    userNews(creatorId: $creatorId) {
      _id
      creatorId
      headline
      textBody
      creationDate
      image
    }
  }
`;
