import React, { useContext, useEffect, useState } from "react";

import DateFnsUtils from "@date-io/date-fns";
import { enAU } from "date-fns/locale";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  RouteComponentProps,
  withRouter,
  useLocation,
  useHistory,
  Switch,
} from "react-router-dom";
import { useAuth, db, firebase } from "./Firebase";

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import Auth, { SignOut } from "./Pages/Auth";
import Start from "./Pages/Start";
import Create from "./Pages/Create";
import Join from "./Pages/Join";
import { UserDetails, UserDetailsState } from "./Schema/User";
import { StateProvider, StateStoreContext } from "./Context";
import { ChooseName } from "./Pages/Auth";
import { Header } from "./Components/Header";
import { Snack } from "./Components/Snack";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      light: "#ba8fa4",
      main: "#ba8fa4",
      dark: "#8fbaba",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#ba8fa4",
    },
  },
  typography: {
    fontFamily: ["Lucida Console", "Monaco", "monospace"].join(","),
  },
});

const App = () => {
  return (
    <MuiPickersUtilsProvider locale={enAU} utils={DateFnsUtils}>
      <ThemeProvider theme={theme}>
        <StateProvider>
          <CssBaseline />
          <Router>
            <Header />
            <Routes />
          </Router>
          <Snack />
        </StateProvider>
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  );
};

export default App;

const Routes = () => {
  return (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route exact path="/" component={Splash} />

      {/* game related routes */}
      <PrivateRoute path="/join/:id" component={Join} />
      <PrivateRoute path="/game/:id" component={Game} />
      <PrivateRoute path="/start" component={Start} />
      <PrivateRoute path="/create" component={Create} />

      {/* additional pages */}
      <PrivateRoute path="/mygames" component={MyGames} />
      <PrivateRoute path="/options" component={Options} />
      <PrivateRoute path="/instructions" component={Instructions} />
    </Switch>
  );
};

const Splash = () => <p>Splash</p>;
const Game = () => <p>Game</p>;
const MyGames = () => <p>MyGames</p>;
const Options = () => <p>Options</p>;
const Instructions = () => <p>Instructions</p>;

const PrivateRoute: React.ComponentType<any> = ({
  component: Component,
  ...rest
}) => {
  let authState = useAuth();
  let { userDetails, initialising } = useContext(StateStoreContext);

  if (authState.initializing) {
    return <div>authorising</div>;
  }

  if (userDetails == null && !initialising) {
    return <ChooseName />;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        authState.user !== null ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/auth",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};
