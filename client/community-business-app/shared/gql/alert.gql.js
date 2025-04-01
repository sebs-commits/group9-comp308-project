import { gql } from "@apollo/client"

export const CREATE_ALERT = gql`
    mutation CreateAlert($creatorId: String!, $title: String!, $subtitle: String!) {
        createAlert(creatorId: $creatorId, title: $title, subtitle: $subtitle) {
            creatorId
            title
            subtitle            
        }
    }
`;