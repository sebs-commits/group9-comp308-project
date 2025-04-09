import { gql } from "@apollo/client";

export const CREATE_NEWS = gql`
  mutation CreateNews(
    $creatorId: String!
    $headline: String!
    $textBody: String!
    $image: String
  ) {
    createNews(
      creatorId: $creatorId
      headline: $headline
      textBody: $textBody
      image: $image
    ) {
      _id
      creatorId
      headline
      textBody
      creationDate
      image
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
      image
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
