import { gql } from "@apollo/client";

export const GET_DISCUSSIONS_BY_NEWS_ID = gql`
  query DiscussionsByNewsId($newsId: ID!) {
    discussionsByNewsId(newsId: $newsId) {
      _id
      title
      description
      creatorId
      createdAt
      replies {
        _id
        creatorId
        text
        createdAt
      }
    }
  }
`;

export const CREATE_DISCUSSION = gql`
  mutation CreateDiscussion(
    $title: String!
    $description: String!
    $creatorId: String!
    $newsId: ID
  ) {
    createDiscussion(
      title: $title
      description: $description
      creatorId: $creatorId
      newsId: $newsId
    ) {
      _id
      title
      description
      creatorId
      createdAt
      newsId
      replies {
        _id
        creatorId
        text
        createdAt
      }
    }
  }
`;

export const ADD_REPLY_TO_DISCUSSION = gql`
  mutation AddReplyToDiscussion(
    $discussionId: ID!
    $creatorId: String!
    $text: String!
  ) {
    addReplyToDiscussion(
      discussionId: $discussionId
      creatorId: $creatorId
      text: $text
    ) {
      _id
      replies {
        _id
        creatorId
        text
        createdAt
      }
    }
  }
`;
export const GET_ALL_DISCUSSIONS = gql`
  query GetAllDiscussions {
    discussions {
      _id
      title
      description
      creatorId
      createdAt
      replies {
        _id
        creatorId
        text
        createdAt
      }
    }
  }
`;
