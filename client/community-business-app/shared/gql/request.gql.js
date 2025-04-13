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
