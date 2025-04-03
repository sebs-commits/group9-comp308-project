import { gql } from "@apollo/client"

export const CREATE_REQUEST = gql`
    mutation CreateRequest($creatorId: String!, $title: String!, $type: String!, $request: String!) {
        createRequest(creatorId: $creatorId, title: $title, type: $type, request: $request) {
            creatorId
            title
            type
            request
        }
    }
`;