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
import React, { useContext, useEffect, useState, createContext } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useFormik, FormikErrors, FormikHelpers } from "formik";

import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom";
import { useAuth, db, firebase, auth } from "../Firebase";
// import * as api from "../Firebase/Api";
import { GameState } from "../Schema/Game";
import { StateStoreContext } from "../Context";
import { UserDetails } from "../Schema/User";
import { CreateUserDetails } from "../Api";
import { Loading } from "../Components";

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

// context for retrieving auth page state
interface AuthPageStore {
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
  doRedirect: Function;
}
const AuthPageContext = createContext<AuthPageStore>(undefined!);

// don't use separate urls to allow redirect to work
const AuthPage = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  let startingLocation = useLocation<LocationState>();
  let history = useHistory();

  const doRedirect = () => {
    history.push(startingLocation.state.from);
  };

  return (
    <div>
      <AuthPageContext.Provider
        value={{
          setShowSignUp,
          doRedirect,
        }}
      >
        {showSignUp ? <SignUp /> : <SignIn />}
      </AuthPageContext.Provider>
    </div>
  );
};

export default AuthPage;

interface SignInValues {
  email: string;
  password: string;
}

const SignIn = () => {
  const classes = useStyles();
  let { setSnackState } = useContext(StateStoreContext);
  let { setShowSignUp, doRedirect } = useContext(AuthPageContext);

  // const [err, setErr] = useState(null);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnChange: false,
    validate: (values: SignInValues) => {
      const errors: FormikErrors<SignInValues> = {};
      if (!values.email) {
        errors.email = "who are you dawg";
      }
      if (!values.password) {
        errors.password = "what's your password plz";
      }
      return errors;
    },
    onSubmit: (
      { email, password },
      { setSubmitting }: FormikHelpers<SignInValues>,
    ) => {
      auth
        .signInWithEmailAndPassword(email, password)
        .then(() => doRedirect())
        .catch((err) =>
          setSnackState({
            severity: "error",
            message: err.toString(),
          }),
        )
        .finally(() => setSubmitting(false));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Container>
        <Grid
          container
          spacing={3}
          justify="center"
          alignItems="center"
          direction="column"
          className={classes.optionsButtons}
        >
          <Grid item xs={12}>
            <Typography>sign in please</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="email"
              label="email"
              variant="outlined"
              className={classes.button}
              onChange={formik.handleChange}
              value={formik.values.email}
              error={!!formik.errors.email}
              helperText={formik.errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="password"
              label="password"
              variant="outlined"
              type="password"
              className={classes.button}
              onChange={formik.handleChange}
              value={formik.values.password}
              error={!!formik.errors.password}
              helperText={formik.errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              disabled={formik.isSubmitting}
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              sign in
            </Button>
          </Grid>
          <Grid item xs={12}>
            <GoogleSignInButton />
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              className={classes.button}
              onClick={() => setShowSignUp(true)}
            >
              new user?
            </Button>
          </Grid>
        </Grid>
      </Container>
    </form>
  );
};

interface SignUpValues {
  email: string;
  password: string;
  passwordConfirm: string;
}

const SignUp = () => {
  const classes = useStyles();
  let { setSnackState } = useContext(StateStoreContext);
  let { setShowSignUp, doRedirect } = useContext(AuthPageContext);

  // const [err, setErr] = useState(null);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
    validateOnChange: false,
    validate: (values: SignUpValues) => {
      const errors: FormikErrors<SignUpValues> = {};
      if (!values.email) {
        errors.email = "who are you dawg";
      }
      if (!values.password) {
        errors.password = "what's your password plz";
      }
      if (!values.passwordConfirm) {
        errors.passwordConfirm = "gotta test you know your password";
      }
      if (values.password !== values.passwordConfirm) {
        errors.passwordConfirm = "passwords don't match";
      }
      return errors;
    },
    onSubmit: (
      { email, password },
      { setSubmitting }: FormikHelpers<SignUpValues>,
    ) => {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(() => doRedirect())
        .catch((err) =>
          setSnackState({
            severity: "error",
            message: err.toString(),
          }),
        )
        .finally(() => setSubmitting(false));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Container>
        <Grid
          container
          spacing={3}
          justify="center"
          alignItems="center"
          direction="column"
          className={classes.optionsButtons}
        >
          <Grid item xs={12}>
            <Typography>sign in please</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="email"
              label="email"
              variant="outlined"
              className={classes.button}
              onChange={formik.handleChange}
              value={formik.values.email}
              error={!!formik.errors.email}
              helperText={formik.errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="password"
              label="password"
              variant="outlined"
              type="password"
              className={classes.button}
              onChange={formik.handleChange}
              value={formik.values.password}
              error={!!formik.errors.password}
              helperText={formik.errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="passwordConfirm"
              label="password again"
              variant="outlined"
              type="password"
              className={classes.button}
              onChange={formik.handleChange}
              value={formik.values.passwordConfirm}
              error={!!formik.errors.passwordConfirm}
              helperText={formik.errors.passwordConfirm}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              disabled={formik.isSubmitting}
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              sign up
            </Button>
          </Grid>
          <Grid item xs={12}>
            <GoogleSignInButton />
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              className={classes.button}
              onClick={() => setShowSignUp(false)}
            >
              existing user?
            </Button>
          </Grid>
        </Grid>
      </Container>
    </form>
  );
};

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
  let { doRedirect } = useContext(AuthPageContext);

  // let startingLocation = useLocation<LocationState>();
  // console.log(startingLocation.state);

  // take the location this page came from, and redirect to there
  const DoSignIn = () => {
    auth
      .signInWithPopup(provider)
      .then(() => doRedirect())
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
  let authState = useAuth();

  const SelectName = () => {
    if (authState.user === null || authState.user.email === null) {
      console.log("choose name failed", authState.user);
      return;
    }
    // const newUserDetails: UserDetails = {
    //   ID: authState.user.uid,
    //   Email: authState.user.email,
    //   Name: name,
    //   Games: [],
    // };
    CreateUserDetails(authState.user.uid, authState.user.email, name);
  };

  if (authState.initialising) {
    return <Loading />;
  }

  return (
    <Container>
      <Grid
        container
        spacing={3}
        justify="center"
        alignItems="center"
        direction="column"
        className={classes.optionsButtons}
      >
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
    </Container>
  );
};
