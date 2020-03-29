import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import {
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles
} from '@material-ui/core';
import { Link, AddBoxOutlined } from '@material-ui/icons';
import ReactPlayer from 'react-player';
import SoundCloudPlayer from 'react-player/lib/players/SoundCloud';
import YoutubePlayer from 'react-player/lib/players/YouTube';

import { ADD_SONG } from '../graphql/mutations';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center'
  },
  inputUrl: {
    margin: theme.spacing(1)
  },
  addSongButton: {
    margin: theme.spacing(1)
  },
  dialog: {
    textAlign: 'center'
  },
  thumbnail: {
    width: '90%'
  }
}));

const DEFAULT_SONG = {
  duration: 0,
  title: '',
  artist: '',
  thumbnail: ''
};

const AddSong = () => {
  const classes = useStyles();
  const [addSong, { error }] = useMutation(ADD_SONG);
  const [playable, setPlayable] = useState(false);
  const [song, setSong] = useState(DEFAULT_SONG);
  const [dialog, setDialog] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    const isPlayable = SoundCloudPlayer.canPlay(url) || YoutubePlayer.canPlay(url);
    setPlayable(isPlayable);
  }, [url]);

  const handleDialog = () => {
    setDialog(dialog => !dialog);
  };

  const handleUrl = e => {
    setUrl(e.target.value);
  };

  const handleSongChange = e => {
    e.persist();
    setSong(prevSong => ({ ...prevSong, [e.target.name]: e.target.value }));
  };

  const handleEditSong = async ({ player }) => {
    const nestedPlayer = player.player.player;
    let songData;
    if (nestedPlayer.getVideoData) {
      songData = getYoutubeInfo(nestedPlayer);
    } else if (nestedPlayer.getCurrentSound) {
      songData = await getSoundCloudInfo(nestedPlayer);
    }
    setSong({ ...songData, url });
  };

  const handleAddSong = async () => {
    try {
      const { url, title, duration, thumbnail, artist } = song;
      await addSong({
        variables: {
          url: url.length > 0 ? url : null,
          title: title.length > 0 ? title : null,
          artist: artist.length > 0 ? artist : null,
          duration: duration > 0 ? duration : null,
          thumbnail: thumbnail.length > 0 ? thumbnail : null
        }
        // 1st way to fetch updated data
        // ,refetchQueries: [{ query: GET_SONGS }]

        // 2nd way to fetch data
        // update: cashe => {
        //   const prevData = cashe.readQuery({ query: GET_SONGS });
        //   const updatedSongs = [song, ...prevData.songs];
        //   cashe.writeQuery({ query: GET_SONGS, data: { songs: updatedData } });
        // }
      });
      handleDialog();
      setSong(DEFAULT_SONG);
      setUrl('');
    } catch (err) {
      console.error('Error adding song: ', err.message);
    }
  };

  const handleError = field => {
    return error?.networkError?.extensions?.path.includes(field);
  };

  const getYoutubeInfo = player => {
    const duration = player.getDuration();
    const { title, video_id, author } = player.getVideoData();
    const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`;
    return {
      duration,
      title,
      artist: author,
      thumbnail
    };
  };

  const getSoundCloudInfo = player => {
    return new Promise(resolve => {
      player.getCurrentSound(songData => {
        if (songData) {
          resolve({
            duration: Number(songData.duration / 1000),
            title: songData.title,
            artist: songData.user.username,
            thumbnail: songData.artwork_url.replace('-large', '-t500x500')
          });
        }
      });
    });
  };

  const { title, artist, thumbnail } = song;
  return (
    <div className={classes.container}>
      <Dialog className={classes.dialog} open={dialog} onClose={handleDialog}>
        <DialogTitle>Edit</DialogTitle>
        <DialogContent>
          <img className={classes.thumbnail} src={thumbnail} alt="Song Thumbnail" />
          <TextField
            margin="dense"
            name="title"
            label="Title"
            fullWidth
            value={title}
            onChange={handleSongChange}
            error={handleError('title')}
            helperText={handleError('title') && 'Fill out Field.'}
          />
          <TextField
            margin="dense"
            name="artist"
            label="Artist"
            fullWidth
            value={artist}
            onChange={handleSongChange}
            error={handleError('artist')}
            helperText={handleError('artist') && 'Fill out Field.'}
          />
          <TextField
            margin="dense"
            name="thumbnail"
            label="Thumbnail"
            fullWidth
            value={thumbnail}
            onChange={handleSongChange}
            error={handleError('thumbnail')}
            helperText={handleError('thumbnail') && 'Fill out Field.'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialog} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddSong} variant="outlined" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <TextField
        className={classes.inputUrl}
        onChange={handleUrl}
        value={url}
        placeholder="Add a Youtube or Soundcloud Url"
        fullWidth
        margin="normal"
        type="url"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Link />
            </InputAdornment>
          )
        }}
      />
      <Button
        disabled={!playable}
        className={classes.addSongButton}
        onClick={handleDialog}
        variant="contained"
        color="primary"
        endIcon={<AddBoxOutlined />}
      >
        Add
      </Button>
      <ReactPlayer url={url} hidden onReady={handleEditSong} />
    </div>
  );
};

export default AddSong;
