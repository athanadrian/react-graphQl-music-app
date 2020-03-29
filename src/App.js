import React, { createContext, useContext, useReducer } from 'react';

import { Grid, useMediaQuery, Hidden } from '@material-ui/core';

import Header from './components/Header';
import SongList from './components/SongList';
import SongPlayer from './components/SongPlayer';
import AddSong from './components/AddSong';

import songReducer from './reducer';

export const SongContext = createContext({
  song: {
    id: 'e072fcf2-30a3-4aff-85d1-068656a68daf',
    title: 'City of angels (funky remix)',
    artist: 'Maria Victoria',
    thumbnail: 'https://i1.sndcdn.com/artworks-000693990808-eb5lt4-t500x500.jpg',
    url: 'https://soundcloud.com/maria-victoria-401466296/city-of-angels-funky-remix-24k',
    duration: 124.003
  },
  isPlaying: false
});

function App() {
  const initialSongState = useContext(SongContext);
  const [state, dispatch] = useReducer(songReducer, initialSongState);

  const greaterThanSm = useMediaQuery(theme => theme.breakpoints.up('sm'));
  const greaterThanMd = useMediaQuery(theme => theme.breakpoints.up('md'));
  return (
    <SongContext.Provider value={{ state, dispatch }}>
      {/*     1st way to hide an alement
      {greaterThanSm && <Header />} */}
      <Hidden only="xs">
        <Header />
      </Hidden>
      <Grid container spacing={3}>
        <Grid style={{ paddingTop: greaterThanSm ? 80 : 10 }} item xs={12} md={7}>
          <AddSong />
          <SongList />
        </Grid>
        <Grid
          style={
            greaterThanMd
              ? {
                  position: 'fixed',
                  width: '100%',
                  top: 70,
                  right: 0
                }
              : {
                  position: 'fixed',
                  width: '100%',
                  bottom: 0,
                  left: 0
                }
          }
          item
          xs={12}
          md={5}
        >
          <SongPlayer />
        </Grid>
      </Grid>
    </SongContext.Provider>
  );
}

export default App;
