import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../Firebase";

const useStyles = makeStyles(() => ({
  button: {
    width: "300px",
    textTransform: "none",
  },
  optionsButtons: {
    minHeight: "70vh",
  },
}));

const OptionsPage = () => {
  let history = useHistory();
  const classes = useStyles();

  return (
    <React.Fragment>
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
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => auth.signOut().then(() => history.push("/"))}
            >
              sign out
            </Button>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default OptionsPage;
