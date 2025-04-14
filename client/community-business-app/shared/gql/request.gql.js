import { gql } from "@apollo/client";

export const CREATE_REQUEST = gql`
  mutation CreateRequest(
    $creatorId: String!
    $title: String!
    $type: String!
    $request: String!
    $location: String!
  ) {
    createRequest(
      creatorId: $creatorId
      title: $title
      type: $type
      request: $request
      location: $location
    ) {
      creatorId
      title
      type
      request
      location
    }
  }
`;
export const GET_REQUESTS = gql`
  query GetRequests {
    requests {
      id
      creatorId
      title
      type
      request
      location
    }
  }
`;

export const GET_USER_REQUESTS = gql`
  query GetUserRequests($creatorId: String!) {
    userRequests(creatorId: $creatorId) {
      id
      title
      type
      request
      location
    }
  }
`;
export const UPDATE_REQUEST = gql`
  mutation UpdateRequest(
    $_id: ID!
    $creatorId: String!
    $title: String!
    $type: String!
    $request: String!
    $location: String!
  ) {
    updateRequest(
      _id: $_id
      creatorId: $creatorId
      title: $title
      type: $type
      request: $request
      location: $location
    ) {
      id
      title
      type
      request
      location
    }
  }
`;
