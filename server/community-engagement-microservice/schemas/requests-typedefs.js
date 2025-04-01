import { gql } from "apollo-server-express";

export const requestTypeDefs = gql`
    type Requests {
        id: ID!
        creatorId: String!
        title: String!        
        type: String!
        request: String!
    }

    type Query {
        requests: [Requests]
        request(_id: ID!): Requests
    }

    type Mutation {
        createRequest(
            creatorId: String!
            title: String!        
            type: String!
            request: String!           
        ): Requests

        updateRequest(
            _id: ID!,
            creatorId: String!
            title: String!        
            type: String!
            request: String!  
        ): Requests

        deleteRequest( _id: ID! ): Requests
    }
`;