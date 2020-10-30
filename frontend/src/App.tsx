import DateFnsUtils from "@date-io/date-fns";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { enAU } from "date-fns/locale";
import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { Authorising, baseThemeOptions, Header, Snack } from "./Components";
import { StateProvider, StateStoreContext } from "./Context";
import { useAuth } from "./Firebase";
import {
  AuthPage,
  CreateGamePage,
  GamePage,
  InstructionsPage,
  JoinGamePage,
  MyGamesPage,
  OptionsPage,
  SplashPage,
  StartPage,
} from "./Pages";
import { ChooseName } from "./Pages/AuthPage";

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
    return <Authorising />;
  }

  if (
    authState.user !== null &&
    !authState.initialising &&
    userDetails === null &&
    !userDetailsInitialising
  ) {
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
