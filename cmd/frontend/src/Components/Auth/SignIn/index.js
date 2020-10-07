import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import React, { useState } from "react"; // update
import { useHistory } from "react-router-dom";
import { auth } from "./firebase";

const useStyles = makeStyles(() => ({
  button: {
    width: "300px",
    textTransform: "none",
  },

  optionsButtons: {
    minHeight: "70vh",
  },
}));

export default () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  let history = useHistory();
  let query = useQuery();

  let target = query.get("target");

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
        <Typography>sign in please</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={email}
          id="email"
          label="email"
          variant="outlined"
          className={classes.button}
          onChange={(e) => {
            setEmail(e.currentTarget.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={password}
          id="password"
          label="password"
          variant="outlined"
          type="password"
          className={classes.button}
          onChange={(e) => {
            setPassword(e.currentTarget.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() =>
            auth
              .signInWithEmailAndPassword(email, password)
              .then(console.log)
              .catch((err) => setErr(err.toString()))
          }
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
          onClick={() => history.push(`/signup?target=${target}`)}
        >
          new user?
        </Button>
      </Grid>
    </Grid>
  );
};

const GoogleSignInButton = () => {
  const classes = useStyles();
  const provider = new firebase.auth.GoogleAuthProvider();

  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        className={classes.button}
        onClick={() => auth.signInWithPopup(provider)}
      >
        sign in with google
      </Button>
    </div>
  );
};
