import React from "react";
import Header from "./components/Header";
import SongList from "./components/SongList";
import SongPlayer from "./components/SongPlayer";
import AddSong from "./components/AddSong";

import { Grid, useMediaQuery, Hidden } from "@material-ui/core";

function App() {
  const greaterThanSm = useMediaQuery(theme => theme.breakpoints.up("sm"));
  const greaterThanMd = useMediaQuery(theme => theme.breakpoints.up("md"));
  return (
    <>
      {/*     1st way to hide an alement
      {greaterThanSm && <Header />} */}
      <Hidden only="xs">
        <Header />
      </Hidden>
      <Grid container spacing={3}>
        <Grid
          style={{ paddingTop: greaterThanSm ? 80 : 10 }}
          item
          xs={12}
          md={7}
        >
          <AddSong />
          <SongList />
        </Grid>
        <Grid
          style={
            greaterThanMd
              ? {
                  position: "fixed",
                  width: "100%",
                  top: 70,
                  right: 0
                }
              : {
                  position: "fixed",
                  width: "100%",
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
    </>
  );
}

export default App;
