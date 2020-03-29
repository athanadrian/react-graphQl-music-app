import React, { useState, useContext, useRef } from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  makeStyles,
  Slider,
  CardMedia
} from '@material-ui/core';
import { PlayArrow, SkipPrevious, SkipNext, Pause } from '@material-ui/icons';
import ReactPlayer from 'react-player';

import { SongContext } from '../App';
import { GET_QUEUED_SONGS } from '../graphql/queries';
import QueuedSongList from './QueuedSongList';
import { useEffect } from 'react';

const userStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0px 15px'
  },
  content: {
    flex: '1 0 auto'
  },
  thumbnail: {
    width: 150
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  playButton: {
    width: 38,
    height: 38
  }
}));

const SongPlayer = () => {
  const { state, dispatch } = useContext(SongContext);
  const { data } = useQuery(GET_QUEUED_SONGS);
  const [positionInQueuedSongs, setPositionInQueuedSongs] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [played, setPlayed] = useState(0);
  const reactPlayerRef = useRef();
  const classes = userStyles();

  useEffect(() => {
    const songIndex = data.queuedSongs.findIndex(song => song.id === state.song.id);
    setPositionInQueuedSongs(songIndex);
  }, [data.queuedSongs, state.song.id]);

  useEffect(() => {
    const nextSong = data.queuedSongs[positionInQueuedSongs + 1];
    if (played >= 0.99 && nextSong) {
      setPlayed(0);
      dispatch({ type: 'SET_SONG', payload: { song: nextSong } });
    }
  }, [data.queuedSongs, played, dispatch, positionInQueuedSongs]);

  const handlePlaySong = () => {
    dispatch(state.isPlaying ? { type: 'PAUSE_SONG' } : { type: 'PLAY_SONG' });
  };

  const handleSliderProgressChange = (e, newValue) => {
    setPlayed(newValue);
  };

  const handleSeekingMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekingMouseUp = () => {
    setSeeking(false);
    setPlayedSeconds(playedSeconds);
    reactPlayerRef.current.seekTo(played);
  };

  const formatDuration = seconds => {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  };

  const handlePlayPreviousSong = () => {
    const previousSong = data.queuedSongs[positionInQueuedSongs - 1];
    if (previousSong) {
      dispatch({ type: 'SET_SONG', payload: { song: previousSong } });
    }
  };

  const handlePlayNextSong = () => {
    const nextSong = data.queuedSongs[positionInQueuedSongs + 1];
    if (nextSong) {
      dispatch({ type: 'SET_SONG', payload: { song: nextSong } });
    }
  };

  return (
    <>
      <Card className={classes.container} variant="outlined">
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography variant="h5" component="h3">
              {state.song.title}
            </Typography>
            <Typography variant="subtitle1" component="p" color="textSecondary">
              {state.song.artist}
            </Typography>
          </CardContent>
          <div className={classes.controls}>
            <IconButton onClick={handlePlayPreviousSong}>
              <SkipPrevious />
            </IconButton>
            <IconButton onClick={handlePlaySong}>
              {state.isPlaying ? (
                <Pause className={classes.playButton} />
              ) : (
                <PlayArrow className={classes.playButton} />
              )}
            </IconButton>
            <IconButton onClick={handlePlayNextSong}>
              <SkipNext />
            </IconButton>
            <Typography variant="subtitle1" component="p" color="textSecondary">
              {formatDuration(playedSeconds)}
            </Typography>
          </div>
          <Slider
            onMouseDown={handleSeekingMouseDown}
            onMouseUp={handleSeekingMouseUp}
            onChange={handleSliderProgressChange}
            value={played}
            type="range"
            min={0}
            max={1}
            step={0.01}
          />
        </div>
        <ReactPlayer
          ref={reactPlayerRef}
          onProgress={({ played, playedSeconds }) => {
            if (!seeking) {
              setPlayed(played);
              setPlayedSeconds(playedSeconds);
            }
          }}
          hidden
          url={state.song.url}
          playing={state.isPlaying}
        />
        <CardMedia className={classes.thumbnail} image={state.song.thumbnail} />
      </Card>
      <QueuedSongList queuedSongs={data.queuedSongs} />
    </>
  );
};

export default SongPlayer;
