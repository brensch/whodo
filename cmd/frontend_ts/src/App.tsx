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
import JoinGame from "./Pages/JoinGame";
import { UserDetails } from "./Schema/User";
import { UserContext } from "./Context";
import { ChooseName } from "./Pages/Auth";

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
  let authState = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    if (authState.user !== null) {
      const userDetailConnector = new UserDetails(
        authState.user.uid,
        authState.user.email
      );
      userDetailConnector.connect(setUserDetails);
    }
  }, [authState]);

  return (
    <MuiPickersUtilsProvider locale={enAU} utils={DateFnsUtils}>
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={userDetails}>
          <CssBaseline />
          <Router>
            <Routes />
          </Router>
        </UserContext.Provider>
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
      <PrivateRoute path="/join/:id" component={JoinGame} />
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
const Create = () => <p>Create</p>;
const Game = () => <p>Game</p>;
const MyGames = () => <p>MyGames</p>;
const Options = () => <p>Options</p>;
const Instructions = () => <p>Instructions</p>;

const PrivateRoute: React.ComponentType<any> = ({
  component: Component,
  ...rest
}) => {
  let authState = useAuth();
  let userDetails = useContext(UserContext);

  if (authState.initializing) {
    return <div>authorising</div>;
  }

  if (userDetails == null) {
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
