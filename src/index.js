import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import client from "./graphql/client";
import App from "./App";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import theme from "./components/theme";

ReactDOM.render(
  <ApolloProvider client={client}>
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </MuiThemeProvider>
  </ApolloProvider>,
  document.getElementById("root")
);
