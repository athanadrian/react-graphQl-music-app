import React from "react";
import {
  Typography,
  IconButton,
  makeStyles,
  Avatar,
  useMediaQuery
} from "@material-ui/core";

import { Delete } from "@material-ui/icons";

const useStyles = makeStyles({
  container: {
    width: "100%",
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateColumns: "50px auto 50px",
    alignItems: "center",
    marginTop: 10
  },
  text: {
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  songInfoContainer: {
    overflow: "hidden",
    whiteSpace: "nowrap"
  },
  avatar: {
    width: 44,
    height: 44
  }
});

const QueuedSongList = () => {
  const greaterThanMd = useMediaQuery(theme => theme.breakpoints.up("md"));
  const queuedSong = {
    title: "dummy song",
    artist: "dummy artist",
    thumbnail: "http://i.ytimg.com/vi/RJjiNnB_eVo/hqdefault.jpg"
  };

  return (
    greaterThanMd && (
      <div
        style={{
          margin: "10px 0"
        }}
      >
        <Typography variant="h5" component="h6">
          QUEUED (5)
        </Typography>
        {Array.from({ length: 5 }, () => queuedSong).map((qSong, i) => (
          <QueuedSong key={i} qSong={qSong} />
        ))}
      </div>
    )
  );
};

function QueuedSong({ qSong }) {
  const classes = useStyles();
  const { title, artist, thumbnail } = qSong;
  return (
    <div className={classes.container}>
      <Avatar className={classes.avatar} src={thumbnail} />
      <div className={classes.songInfoContainer}>
        <Typography variant="subtitle2" className={classes.text}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.text}
        >
          {artist}
        </Typography>
      </div>
      <IconButton size="small" color="secondary">
        <Delete color="error" />
      </IconButton>
    </div>
  );
}

export default QueuedSongList;
