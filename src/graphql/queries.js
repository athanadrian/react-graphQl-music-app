import { gql } from "apollo-boost";

export const GET_QUEUED_SONGS = gql`
  query getQueuedSongs {
    queuedSongs @client {
      artist
      duration
      id
      thumbnail
      title
      url
    }
  }
`;
