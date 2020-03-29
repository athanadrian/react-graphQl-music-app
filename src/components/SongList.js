import React, { useContext, useState } from "react";

import {
  Card,
  CircularProgress,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  makeStyles
} from "@material-ui/core";
import {
  PlayArrow,
  QueuePlayNext,
  Pause,
  HighlightOff
} from "@material-ui/icons";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { GET_SONGS } from "../graphql/subscriptions";
import { SongContext } from "../App";
import { useEffect } from "react";
import {
  ADD_OR_REMOVE_FROM_QUEUED_SONGS,
  DELETE_SONG
} from "../graphql/mutations";

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(1)
  },
  songInfoContainer: {
    display: "flex",
    alignItems: "center"
  },
  songInfo: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between"
  },
  thumbnail: {
    width: 150,
    height: 150,
    objectFit: "cover"
  },
  error: {
    color: "warning"
  }
}));

const SongList = () => {
  const { data, loading, error } = useSubscription(GET_SONGS);
  const [addOrRemoveFromQueuedSongs] = useMutation(
    ADD_OR_REMOVE_FROM_QUEUED_SONGS,
    {
      onCompleted: data => {
        localStorage.setItem(
          "queuedSongs",
          JSON.stringify(data.addOrRemoveFromQueuedSongs)
        );
      }
    }
  );
  const [deleteSongFromList] = useMutation(DELETE_SONG, {
    onCompleted: data => {
      localStorage.setItem(
        "deletedSongs",
        JSON.stringify(data.deleteSongFromList)
      );
    }
  });
  const classes = useStyles();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 50
        }}
      >
        <CircularProgress />
        <p>loading.......</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.error}>
        Error fetching Songs... , {error.message}
      </div>
    );
  }
  return (
    <div>
      {data.songs.map(song => (
        <Song key={song.id} {...song} />
      ))}
    </div>
  );

  function Song({ ...song }) {
    const classes = useStyles();
    const { id, title, artist, thumbnail } = song;
    const [isCurrentSongPlaying, setIsCurrentSongPlaying] = useState(false);
    const { state, dispatch } = useContext(SongContext);

    useEffect(() => {
      const isSongPLaying = state.isPlaying && id === state.song.id;
      setIsCurrentSongPlaying(isSongPLaying);
    }, [id, state.song.id, state.isPlaying]);

    const handlePlaySong = () => {
      dispatch({ type: "SET_SONG", payload: { song } });
      dispatch(
        state.isPlaying ? { type: "PAUSE_SONG" } : { type: "PLAY_SONG" }
      );
    };

    const handleOrRemoveFromQueuedSongs = () => {
      addOrRemoveFromQueuedSongs({
        variables: { input: { ...song }, __typename: "Song" }
      });
    };

    // const handleDeleteTodo = async ({ id }) => {
    //   const isConfirmed = window.confirm("You want to delete it?");
    //   if (isConfirmed) {
    //     const data = await deleteTodo({
    //       variables: { id },
    //       update: cashe => {
    //         const prevData = cashe.readQuery({ query: GET_TODOS });
    //         const updatedTodos = prevData.todos.filter(todo => todo.id !== id);
    //         cashe.writeQuery({
    //           query: GET_TODOS,
    //           data: { todos: updatedTodos }
    //         });
    //       }
    //     });
    //     console.log("delete todo ", data);
    //   }
    // };

    const handleDeleteSongFromList = async ({ id }) => {
      const isConfirmed = window.confirm("You want to delete it?");
      if (isConfirmed) {
        const data = await deleteSongFromList({
          variables: { id }
        });
        localStorage.setItem("deletedSongs", JSON.stringify(data));
        console.log("delete song ", data);
      }
    };

    return (
      <Card className={classes.container}>
        <div className={classes.songInfoContainer}>
          <CardMedia className={classes.thumbnail} image={thumbnail} />
          <div className={classes.songInfo}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {title}
              </Typography>
              <Typography variant="body1" component="p" color="textSecondary">
                {artist}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton size="small" color="primary" onClick={handlePlaySong}>
                {isCurrentSongPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
              <IconButton
                size="small"
                color="secondary"
                onClick={handleOrRemoveFromQueuedSongs}
              >
                <QueuePlayNext />
              </IconButton>
              <IconButton
                size="small"
                color="secondary"
                onClick={() => handleDeleteSongFromList(song)}
              >
                <HighlightOff color="error" />
              </IconButton>
            </CardActions>
          </div>
        </div>
      </Card>
    );
  }
};

export default SongList;
