import { gql } from "@apollo/client";

export const CREATE_NEWS = gql`
    mutation CreateNews($creatorId: String!, $headline: String!, $summary: String!, $fullnews: String!, $creationDate: String!, $expiryDate: String!) {
        createNews(creatorId: $creatorId, headline: $headline, summary: $summary, fullnews: $fullnews, creationDate: $creationDate, expiryDate: $expiryDate) {
            creatorId
            headline
            summary
            fullnews
            creationDate
            expiryDate
        }
    }
`;

export const GET_NON_EXPIRED_NEWS = gql`
    query AllNoneExpiredNews {
        allNoneExpiredNews {
            _id
            headline
            summary
            fullnews
            creationDate
            expiryDate
        }
    }
`;