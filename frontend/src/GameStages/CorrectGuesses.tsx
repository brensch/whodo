import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useContext } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useHistory } from "react-router-dom";
import { StateStoreContext } from "../Context";
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
  let { setSnackState } = useContext(StateStoreContext);

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
                      {guesserPick?.CharacterName} ({guesserUser?.Name})
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <b>who:</b> {guess.Killer} ({killerUser?.Name})
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <b>why:</b> {guess.Why}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <b>how:</b> {guess.How}
                    </Typography>
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
          <CopyToClipboard
            text={`I just played whowhyhow and i think you would like it, because it is excellent: ${window.location.origin}/splash`}
          >
            <Button
              variant="contained"
              color="primary"
              className={classes.buttonFullWidth}
              onClick={() =>
                setSnackState({
                  severity: "info",
                  message:
                    "copied share info to clipboard, go paste it somewhere.",
                })
              }
            >
              share
            </Button>
          </CopyToClipboard>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttonFullWidth}
            onClick={() =>
              window.open("https://www.buymeacoffee.com/whowhyhow", "_blank")
            }
          >
            buy me a coffee
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
