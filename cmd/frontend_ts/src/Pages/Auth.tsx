import AppBar from "@material-ui/core/AppBar";
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Fade from "@material-ui/core/Fade";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CloseIcon from "@material-ui/icons/Close";
import HomeIcon from "@material-ui/icons/Home";
import InfoIcon from "@material-ui/icons/Info";
import Alert from "@material-ui/lab/Alert";
import { DateTimePicker } from "@material-ui/pickers";
import { formatDistance } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom";
import { useAuth, db, firebase, auth } from "../Firebase";
// import * as api from "../Firebase/Api";
import { Game } from "../Schema/Game";
import { UserContext } from "../Context";
import { UserDetails } from "../Schema/User";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  button: {
    width: "300px",
    textTransform: "none",
  },
  optionsButtons: {
    minHeight: "70vh",
  },
}));

interface LocationState {
  from: {
    pathname: string;
  };
}

// don't use separate urls to allow redirect to work
const Auth = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  console.log("auth");

  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        // className={classes.button}
        onClick={() => setShowSignUp(!showSignUp)}
      >
        sign in with google
      </Button>
      {showSignUp ? <SignUp /> : <SignIn />}
    </div>
  );
};

export default Auth;

const SignIn = () => (
  <div>
    sign in
    <GoogleSignInButton />
  </div>
);
const SignUp = () => (
  <div>
    sign up
    <GoogleSignInButton />
  </div>
);

export const SignOut = () => {
  const classes = useStyles();

  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        className={classes.button}
        onClick={() => auth.signOut()}
      >
        sign out
      </Button>
    </div>
  );
};

const GoogleSignInButton = () => {
  const classes = useStyles();
  const provider = new firebase.auth.GoogleAuthProvider();
  let startingLocation = useLocation<LocationState>();
  console.log(startingLocation.state);

  let history = useHistory();

  // take the location this page came from, and redirect to there
  const DoSignIn = () => {
    auth
      .signInWithPopup(provider)
      .then(() => history.push(startingLocation.state.from))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        className={classes.button}
        onClick={DoSignIn}
      >
        sign in with google
      </Button>
    </div>
  );
};

export const ChooseName = () => {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [err, setErr] = useState(null);
  let authState = useAuth();
  // let query = useQuery();

  // let target = query.get("target");

  const SelectName = () => {
    if (authState.user === null) {
      return;
    }
    const newUserDetails = new UserDetails(
      authState.user.uid,
      authState.user.email
    );
    // db.collection("user_details").doc(newUserDetails.ID).set(newUserDetails);
    newUserDetails.addToFirestore(name);
    // const userDetails = {
    //   id: authState.user,
    //   name: name,
    //   email: authState.user.email,
    // };
    // db.collection("user_details").doc(authState.user.uid).set(userDetails);
  };

  if (authState.user === null) {
    return <div>loading</div>;
  }

  return (
    <Grid
      container
      spacing={3}
      justify="center"
      alignItems="center"
      direction="column"
      className={classes.optionsButtons}
    >
      <Snackbar
        open={err !== null}
        autoHideDuration={6000}
        onClose={() => setErr(null)}
      >
        <Alert onClose={() => setErr(null)} severity="error">
          {err}
        </Alert>
      </Snackbar>
      <Grid item xs={12}>
        <Typography>pick a hilarious yet identifiable name</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={name}
          id="name"
          label="name"
          variant="outlined"
          className={classes.button}
          onChange={(e) => {
            setName(e.currentTarget.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => SelectName()}
        >
          choose this cool name
        </Button>
      </Grid>
    </Grid>
  );
};
