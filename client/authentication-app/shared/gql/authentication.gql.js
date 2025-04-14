import { gql } from "@apollo/client";

export const GET_USERS = gql`
    query Users {
        users {
            id
            username
            email
            type
            password
            interests
            location
            eventMatches
            requestMatches
            ignoredMatches
        }
    }
`;

export const GET_USER = gql`
    query User($id: ID!) {
        user(id: $id) {
            id
            username
            email
            type
            password
            interests
            location
            eventMatches
            requestMatches
            ignoredMatches
        }
    }
`;

export const GET_USER_BY_USERNAME = gql`
    query GetUserByUsername($username: String!) {
        getUserByUsername(username: $username)
    }
`;

export const CREATE_USER = gql`
    mutation CreateUser($username: String!, $email: String!, $type: String!, $password: String!) {
        createUser(username: $username, email: $email, type: $type, password: $password) {
            username
            email
            type
        }
    }
`;

export const UPDATE_VOLUNTEER = gql`
    mutation UpdateVolunteer($id: ID!, $interests: String!, $location: String!, $eventMatches: String!, $requestMatches: String!, $ignoredMatches: String!) {
        updateVolunteer(id: $id, interests: $interests, location: $location, eventMatches: $eventMatches, requestMatches: $requestMatches, ignoredMatches: $ignoredMatches) {
            id
            interests
            location
            eventMatches
            requestMatches
            ignoredMatches
        }
    }
`;

export const LOGIN_USER = gql`
    mutation LoginUser($username: String!, $password: String!) {
        loginUser(username: $username, password: $password)
    }
`;

export const LOGOUT = gql`
    mutation Logout {
        logout
    }
`;