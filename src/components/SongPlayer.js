import React from "react";
import QueuedSongList from "./QueuedSongList";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  makeStyles,
  Slider,
  CardMedia
} from "@material-ui/core";
import { PlayArrow, SkipPrevious, SkipNext } from "@material-ui/icons";

const userStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    justifyContent: "space-between"
  },
  details: {
    display: "flex",
    flexDirection: "column",
    padding: "0px 15px"
  },
  content: {
    flex: "1 0 auto"
  },
  thumbnail: {
    width: 150
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  playButton: {
    width: 38,
    height: 38
  }
}));

const SongPlayer = () => {
  const classes = userStyles();
  return (
    <>
      <Card className={classes.container} variant="outlined">
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography variant="h5" component="h3">
              Title
            </Typography>
            <Typography variant="subtitle1" component="p" color="textSecondary">
              Artist
            </Typography>
          </CardContent>
          <div className={classes.controls}>
            <IconButton>
              <SkipPrevious />
            </IconButton>
            <IconButton>
              <PlayArrow className={classes.playButton} />
            </IconButton>
            <IconButton>
              <SkipNext />
            </IconButton>
            <Typography variant="subtitle1" component="p" color="textSecondary">
              00:00:00
            </Typography>
          </div>
          <Slider type="range" min={0} max={1} step={0.01} />
        </div>
        <CardMedia
          className={classes.thumbnail}
          image="http://i.ytimg.com/vi/RJjiNnB_eVo/hqdefault.jpg"
        />
      </Card>
      <QueuedSongList />
    </>
  );
};

export default SongPlayer;
