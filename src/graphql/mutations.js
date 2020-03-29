import { gql } from "apollo-boost";

export const ADD_OR_REMOVE_FROM_QUEUED_SONGS = gql`
  mutation addOrRemoveFromQueuedSongs($input: SongInput) {
    addOrRemoveFromQueuedSongs(input: $input) @client
  }
`;

export const ADD_SONG = gql`
  mutation addSong(
    $title: String!
    $artist: String!
    $url: String!
    $thumbnail: String!
    $duration: Float!
  ) {
    insert_songs(
      objects: {
        title: $title
        artist: $artist
        url: $url
        thumbnail: $thumbnail
        duration: $duration
      }
    ) {
      affected_rows
    }
  }
`;

export const DELETE_SONG = gql`
  mutation deleteSong($id: uuid) {
    delete_songs(where: { id: { _eq: $id } }) {
      returning {
        title
        url
        artist
      }
    }
  }
`;
