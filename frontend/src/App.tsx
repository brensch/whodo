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

import {
  ThemeProvider,
  createMuiTheme,
  ThemeOptions,
} from "@material-ui/core/styles";

import {
  AuthPage,
  StartPage,
  OptionsPage,
  CreateGamePage,
  JoinGamePage,
  GamePage,
  SplashPage,
  MyGamesPage,
  InstructionsPage,
} from "./Pages";
import { UserDetails, UserDetailsState } from "./Schema/User";
import { StateProvider, StateStoreContext } from "./Context";
import { ChooseName } from "./Pages/AuthPage";
import { Header, Snack, baseThemeOptions } from "./Components";

const theme = createMuiTheme(baseThemeOptions);

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
      <Route path="/splash" component={SplashPage} />

      {/* game related routes */}
      <PrivateRoute exact path="/" component={StartPage} />
      <PrivateRoute path="/join/:id" component={JoinGamePage} />
      <PrivateRoute path="/game/:id" component={GamePage} />
      <PrivateRoute path="/create" component={CreateGamePage} />

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
