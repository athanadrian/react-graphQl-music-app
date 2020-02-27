import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles
} from "@material-ui/core";

import { Link, AddBoxOutlined } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    alignItems: "center"
  },
  inputUrl: {
    margin: theme.spacing(1)
  },
  addSongButton: {
    margin: theme.spacing(1)
  },
  dialog: {
    textAlign: "center"
  },
  thumbnail: {
    width: "90%"
  }
}));

const AddSong = () => {
  const classes = useStyles();
  const [dialog, setDialog] = useState(false);

  const handleDialog = () => {
    setDialog(dialog => !dialog);
  };

  return (
    <div className={classes.container}>
      <Dialog className={classes.dialog} open={dialog} onClose={handleDialog}>
        <DialogTitle>Edit</DialogTitle>
        <DialogContent>
          <img
            className={classes.thumbnail}
            src="https://38cnsy2ees0v3wanzd1lt0vq-wpengine.netdna-ssl.com/wp-content/uploads/2018/06/shutterstock_167769761.jpg"
            alt="Song Thumbnail"
          />
          <TextField margin="dense" name="title" label="Title" fullWidth />
          <TextField margin="dense" name="artist" label="Artist" fullWidth />
          <TextField
            margin="dense"
            name="thumbnail"
            label="Thumbnail"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialog} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button variant="outlined" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <TextField
        className={classes.inputUrl}
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
        className={classes.addSongButton}
        onClick={handleDialog}
        variant="contained"
        color="primary"
        endIcon={<AddBoxOutlined />}
      >
        Add
      </Button>
    </div>
  );
};

export default AddSong;
