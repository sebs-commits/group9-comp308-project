import { gql } from "@apollo/client";

export const CREATE_USER = gql`
    mutation CreateUser($username: String!, $email: String!, $type: String!, $password: String!) {
        createUser(username: $username, email: $email, type: $type, password: $password) {
            username
            email
            type
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