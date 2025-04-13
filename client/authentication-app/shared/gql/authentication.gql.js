import { gql } from "@apollo/client";

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
            participation
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
    mutation UpdateVolunteer($id: ID!, $interests: String!, $location: String!, $participation: String!) {
        updateVolunteer(id: $id, interests: $interests, location: $location, participation: $participation) {
            id
            interests
            location
            participation
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