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
                    start conversations using your public info, but only reveal
                    your private info when asked about it by another character.
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
                    it gets weird if you lie about your secrets. gotta come
                    clean when asked.
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
                    once you've revealed all your information for a round,
                    there's a button down the buttom to show you're ready for
                    the next round.{" "}
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
                    once all rounds are finished, make a guess about who did it
                    and why. once everyone has guessed, the true story is
                    revealed.
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
                    the winner is whoever has the most fun (or all people who
                    guessed the killer correctly){" "}
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
            onClick={() => SetReadRules(playerView.ID)}
          >
            <Typography align="center">let's go</Typography>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
