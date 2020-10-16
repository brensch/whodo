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

import AuthPage, { SignOut } from "./Pages/AuthPage";
import StartPage from "./Pages/StartPage";
import OptionsPage from "./Pages/OptionsPage";
import CreatePage from "./Pages/CreateGamePage";
import JoinPage from "./Pages/JoinGamePage";
import GamePage from "./Pages/GamePage";
import SplashPage from "./Pages/SplashPage";
import MyGamesPage from "./Pages/MyGamesPage";
import InstructionsPage from "./Pages/InstructionsPage";
import { UserDetails, UserDetailsState } from "./Schema/User";
import { StateProvider, StateStoreContext } from "./Context";
import { ChooseName } from "./Pages/AuthPage";
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
      <Route path="/auth" component={AuthPage} />
      <Route exact path="/" component={SplashPage} />

      {/* game related routes */}
      <PrivateRoute path="/join/:id" component={JoinPage} />
      <PrivateRoute path="/game/:id" component={GamePage} />
      <PrivateRoute path="/start" component={StartPage} />
      <PrivateRoute path="/create" component={CreatePage} />

      {/* additional pages */}
      <PrivateRoute path="/mygames" component={MyGamesPage} />
      <PrivateRoute path="/options" component={OptionsPage} />
      <PrivateRoute path="/instructions" component={InstructionsPage} />
    </Switch>
  );
};

const PrivateRoute: React.ComponentType<any> = ({
  component: Component,
  ...rest
}) => {
  let authState = useAuth();
  let { userDetails, userDetailsInitialising } = useContext(StateStoreContext);

  if (authState.initialising) {
    return <div>authorising</div>;
  }

  console.log(userDetails);

  if (
    authState.user !== null &&
    !authState.initialising &&
    userDetails === null &&
    !userDetailsInitialising
  ) {
    console.log("displayed choosename");
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
