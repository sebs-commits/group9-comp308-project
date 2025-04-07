import { gql } from "@apollo/client";

export const CREATE_NEWS = gql`
  mutation CreateNews(
    $creatorId: String!
    $headline: String!
    $textBody: String!
  ) {
    createNews(
      creatorId: $creatorId
      headline: $headline
      textBody: $textBody
    ) {
      _id
      creatorId
      headline
      textBody
      creationDate
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
    }
  }
`;
// Removing this for now, not sure if it is still needed
// export const GET_NON_EXPIRED_NEWS = gql`
//   query AllNoneExpiredNews {
//     allNoneExpiredNews {
//       _id
//       headline
//       summary
//       fullnews
//       creationDate
//       expiryDate
//     }
//   }
// `;
