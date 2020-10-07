import React, { useContext, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import { firebase, auth } from "../Firebase";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  button: {
    width: "300px",
    textTransform: "none",
  },
}));

const SignOut = () => {
  return (
    <div>
      <GoogleSignOutButton />
      butt
    </div>
  );
};

export default SignOut;

const GoogleSignOutButton = () => {
  const classes = useStyles();

  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        className={classes.button}
        onClick={() => auth.signOut()}
      >
        sign out with google
      </Button>
    </div>
  );
};
