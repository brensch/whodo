import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { FormikErrors, FormikHelpers, useFormik } from "formik";
import React, { createContext, useContext, useState } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { CreateUserDetails } from "../Api";
import { Authorising, Loading } from "../Components";
import { auth, firebase, useAuth } from "../Firebase";
import { StateStoreContext } from "../Context";

const useStyles = makeStyles(() => ({
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
  const { userDetails, userDetailsInitialising } = useContext(
    StateStoreContext,
  );

  const doRedirect = () => {
    history.push(startingLocation.state.from);
  };
  console.log(userDetails);

  if (userDetailsInitialising) {
    return <Authorising />;
  }

  if (!!userDetails) {
    return <Redirect to={"/"} />;
  }

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
            <Typography>hey.</Typography>
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
            <Typography>whohowwhy is fun i promise</Typography>
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
  const { setSnackState } = useContext(StateStoreContext);

  // take the location this page came from, and redirect to there
  const DoSignIn = () => {
    auth
      .signInWithPopup(provider)
      .then(() => doRedirect())
      .catch((err) =>
        setSnackState({
          severity: "error",
          message: err.toString(),
        }),
      );
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
      return;
    }

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
