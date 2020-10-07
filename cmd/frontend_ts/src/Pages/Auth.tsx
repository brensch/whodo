import React, { useContext, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import { firebase, auth } from "../Firebase";

import { useLocation, RouteComponentProps, useHistory } from "react-router-dom";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  button: {
    width: "300px",
    textTransform: "none",
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
