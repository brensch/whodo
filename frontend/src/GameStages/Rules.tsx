import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useContext } from "react";
import { SetReadRules } from "../Api";
import { StateStoreContext } from "../Context";
import { GamePageContext } from "../Pages/GamePage";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  optionsButtons: {
    minHeight: "70vh",
  },
  buttonFullWidth: {
    width: "100%",
    textTransform: "none",
  },
}));

export default () => {
  const classes = useStyles();
  let { gameState, playerView } = useContext(GamePageContext);
  const { userDetails, userDetailsInitialising } = useContext(
    StateStoreContext,
  );

  if (
    userDetails === null ||
    userDetailsInitialising ||
    gameState.SelectedStory === null
  ) {
    return null;
  }

  return (
    <Container>
      <Grid
        container
        spacing={3}
        alignItems="stretch"
        direction="column"
        className={classes.optionsButtons}
      >
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            rules
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <List className={classes.root}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="talk"
                secondary={
                  <React.Fragment>
                    tell freely the information labelled 'tell freely'. info
                    labelled 'only tell when asked', you should only tell when
                    asked
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="don't lie"
                secondary={
                  <React.Fragment>
                    just like real life, this won't work if you lie about your
                    secrets, or don't respond with all the info you know when
                    questioned about something.
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="complete rounds"
                secondary={
                  <React.Fragment>
                    once you've run out of info to 'tell freely', hit the button
                    down the bottom to indicate you're ready for the next round.
                    you will often finish rounds and still have secrets yet to
                    tell.
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="guess the killer"
                secondary={
                  <React.Fragment>
                    once all rounds are finished, guess who, why, how. once
                    everyone has guessed, the true story is revealed.
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="have fun/win"
                secondary={
                  <React.Fragment>
                    the winner is whoever has the most fun. bonus points if you
                    guess right as well.
                  </React.Fragment>
                }
              />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttonFullWidth}
            onClick={() => SetReadRules(playerView.ID, true)}
          >
            <Typography align="center">got it</Typography>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
