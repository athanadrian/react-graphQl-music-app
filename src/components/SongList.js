import React from "react";

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
import { PlayArrow, QueuePlayNext } from "@material-ui/icons";

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
  }
}));

const SongList = () => {
  let loading = false;

  const song = {
    title: "Just a dummy title",
    artist: "Dummy Dumm",
    thumbnail: "http://i.ytimg.com/vi/RJjiNnB_eVo/hqdefault.jpg"
  };

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
  return (
    <div>
      {Array.from({ length: 10 }, () => song).map((song, i) => (
        <Song key={i} song={song} />
      ))}
    </div>
  );

  function Song({ song }) {
    const classes = useStyles();
    const { title, artist, thumbnail } = song;
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
              <IconButton size="small" color="primary">
                <PlayArrow />
              </IconButton>
              <IconButton size="small" color="secondary">
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
