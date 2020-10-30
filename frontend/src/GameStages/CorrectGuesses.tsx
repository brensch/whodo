import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { GamePageContext } from "../Pages/GamePage";
import { CharacterPick } from "../Schema/Game";
import { UserDetails } from "../Schema/User";

const useStyles = makeStyles(() => ({
  clues: {
    padding: 10,
    maxWidth: 1000,
    alignContent: "center",
  },
  buttonFullWidth: {
    width: "100%",
    textTransform: "none",
  },
  correctGuess: {
    backgroundColor: "#0c540c",
    opacity: ".5",
  },
  incorrectGuess: {
    backgroundColor: "#540c0c",
    opacity: ".5",
  },
}));

export default () => {
  const classes = useStyles();
  let { gameState } = useContext(GamePageContext);

  let history = useHistory();

  let killer: string =
    gameState.Answers[gameState.Answers.length - 1].Character;

  return (
    <Container>
      <Grid container spacing={3} alignItems="stretch" direction="column">
        <Grid item xs={12}>
          <Typography align="center">
            {gameState.SelectedStory?.Metadata.Conclusion}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography align="center" variant="h6">
            how did everyone go?
          </Typography>
        </Grid>
        {gameState.Guesses.map((guess) => {
          const guesserUser: UserDetails | undefined = gameState.Users.find(
            (user) => user.ID === guess.UserID,
          );

          const guesserPick:
            | CharacterPick
            | undefined = gameState.CharacterPicks.find(
            (pick) => pick.UserID === guess.UserID,
          );

          const killerPick:
            | CharacterPick
            | undefined = gameState.CharacterPicks.find(
            (pick) => pick.CharacterName === guess.Killer,
          );

          const killerUser: UserDetails | undefined = gameState.Users.find(
            (user) => user.ID === killerPick?.UserID,
          );

          return (
            <Grid item xs={12}>
              <Paper
                variant="outlined"
                className={
                  killer === guess.Killer
                    ? classes.correctGuess
                    : classes.incorrectGuess
                }
              >
                <Grid container className={classes.clues}>
                  <Grid item xs={12}>
                    <Typography variant="h5">
                      {guesserPick?.CharacterName} ({guesserUser?.Name}) -{" "}
                      {killer === guess.Killer ? "right!" : "wrong"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      guessed: {guess.Killer} ({killerUser?.Name})
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6">because: {guess.Why}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          );
        })}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttonFullWidth}
            onClick={() => history.push("/create")}
          >
            play a different story
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttonFullWidth}
            onClick={() => history.push("/create")}
          >
            share
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttonFullWidth}
            onClick={() =>
              window.open("https://www.buymeacoffee.com/whodo", "_blank")
            }
          >
            buy me a coffee
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
