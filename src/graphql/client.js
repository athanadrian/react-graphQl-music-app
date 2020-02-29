//***Use ApolloClient from apollo-boost

// import ApolloClient from "apollo-boost";

// const client = new ApolloClient({
//   uri: "https://atana-music-app.herokuapp.com/v1/graphql"
// });

// export default client;

//***Use Subscriptions with ApolloClient from apollo-client

import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import { gql } from "apollo-boost";
import { GET_QUEUED_SONGS } from "./queries";

const client = new ApolloClient({
  link: new WebSocketLink({
    uri: "wss://atana-music-app.herokuapp.com/v1/graphql",
    options: {
      reconnect: true
    }
  }),
  cache: new InMemoryCache(),
  typeDefs: gql`
    type Song {
      id: uuid!
      title: String!
      artist: String!
      thumbnail: String!
      duration: Float!
      url: String!
    }
    input SongInput {
      id: uuid!
      title: String!
      artist: String!
      thumbnail: String!
      duration: Float!
      url: String!
    }
    type Query {
      queuedSongs: [Song]!
    }
    type Mutation {
      addOrRemoveFromQueuedSongs(input: SongInput): [Song]
    }
  `,
  resolvers: {
    Mutation: {
      addOrRemoveFromQueuedSongs: (_, { input }, { cache }) => {
        const queryResult = cache.readQuery({
          query: GET_QUEUED_SONGS
        });
        if (queryResult) {
          const { queuedSongs } = queryResult;
          const isInQueuedSongs = queuedSongs.some(
            song => song.id === input.id
          );
          const newQueuedSongs = isInQueuedSongs
            ? queuedSongs.filter(song => song.id !== input.id)
            : [...queuedSongs, input];
          cache.writeQuery({
            query: GET_QUEUED_SONGS,
            data: { queuedSongs: newQueuedSongs }
          });
          return newQueuedSongs;
        }
        return [];
      }
    }
  }
});

const hasQueuedSongs = Boolean(localStorage.getItem("queuedSongs"));

const data = {
  queuedSongs: hasQueuedSongs
    ? JSON.parse(localStorage.getItem("queuedSongs"))
    : []
};

client.writeData({ data });

export default client;
