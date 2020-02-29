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
import { PlayArrow, QueuePlayNext, Pause } from "@material-ui/icons";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { GET_SONGS } from "../graphql/subscriptions";
import { SongContext } from "../App";
import { useEffect } from "react";
import { ADD_OR_REMOVE_FROM_QUEUED_SONGS } from "../graphql/mutations";

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
            </CardActions>
          </div>
        </div>
      </Card>
    );
  }
};

export default SongList;
