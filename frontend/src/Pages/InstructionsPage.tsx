import { Button } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { StateStoreContext } from "../Context";

const useStyles = makeStyles(() => ({
  optionsButtons: {
    minHeight: "70vh",
  },
  button: {
    width: "100%",
    textTransform: "none",
  },
}));

const Instructions = () => {
  const classes = useStyles();
  let { setHeaderText } = useContext(StateStoreContext);
  useEffect(() => setHeaderText("instructions"), [setHeaderText]);
  let history = useHistory();

  return (
    <Container>
      <Grid
        container
        spacing={2}
        // justify="center"
        alignItems="stretch"
        direction="column"
      >
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            what's this all about?
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography align="center">
            whowhyhow brings the power of the internet to murder mysteries so we
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
              <Typography>friends. 4-6 of them</Typography>
            </li>
            <li>
              <Typography>video chat</Typography>
            </li>
            <li>
              <Typography>sick costumes</Typography>
            </li>
            <li>
              <Typography>
                1.5-2 hours depending on how fast you talk
              </Typography>
            </li>
          </ul>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            how does it work?{" "}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ul>
            <li>
              <Typography>
                schedule a game for the time you want to play
              </Typography>
            </li>
            <li>
              <Typography>
                send out the invite link to everyone you want to join
              </Typography>
            </li>
            <li>
              <Typography>
                once everyone you want to play has joined the game, choose a
                story with as many characters as you have players
              </Typography>
            </li>
            <li>
              <Typography>
                pick a character, then go get your costume ready for the
                scheduled start time
              </Typography>
            </li>
            <li>
              <Typography>
                once the scheduled time arrives, jump on a video call and let
                the fun begin
              </Typography>
            </li>
          </ul>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => history.push("/create")}
          >
            alright got it, let's schedule a game
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Instructions;
