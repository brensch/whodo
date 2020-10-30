import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useContext, useEffect } from "react";
import { StateStoreContext } from "../Context";

const useStyles = makeStyles(() => ({
  optionsButtons: {
    minHeight: "70vh",
  },
}));

const Instructions = () => {
  const classes = useStyles();
  let { setHeaderText } = useContext(StateStoreContext);
  useEffect(() => setHeaderText("instructions"), [setHeaderText]);

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
          <Typography variant="h5" align="center">
            what's this all about?{" "}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography align="center">
            who-do brings the power of the internet to murder mysteries so we
            can all have something to do while locked in our bedrooms.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            you'll need:{" "}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ul>
            <li>
              <Typography>friends. 4-6 of them.</Typography>
            </li>
            <li>
              <Typography>video chat.</Typography>
            </li>
            <li>
              <Typography>sick costumes.</Typography>
            </li>
            <li>
              <Typography>1-2 hours depending on how fast you talk.</Typography>
            </li>
          </ul>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            how does it work?{" "}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography align="center">
            you are given all the information you need to embody a suspicious
            character in a gruesome tale. follow the clues you have been given
            to unravel the lies and deceipt. Expect the unexpected, and the
            winner is the person who has the most fun, so don't be mad if you
            accuse the wrong person of a heinous crime.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Instructions;
