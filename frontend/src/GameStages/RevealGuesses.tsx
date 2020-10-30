import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { SubmitReadyForAnswer } from "../Api";
import { StateStoreContext } from "../Context";
import { GamePageContext, ParamTypes } from "../Pages/GamePage";
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
}));

export default () => {
  const classes = useStyles();
  let { id } = useParams<ParamTypes>();
  let { gameState } = useContext(GamePageContext);
  const { userDetails } = useContext(StateStoreContext);

  let userHasDecided: boolean =
    gameState.ReadyForAnswer.find((userID) => userID === userDetails?.ID) !==
    undefined;

  return (
    <Container>
      <Grid container spacing={3} alignItems="stretch" direction="column">
        <Grid item xs={12}>
          <Typography align="center">
            read everyone's guesses before finding out who did it:
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
              <Paper variant="outlined">
                <Grid container className={classes.clues}>
                  <Grid item xs={12}>
                    <Typography variant="h5">
                      {guesserPick?.CharacterName} ({guesserUser?.Name})
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
            disabled={userHasDecided}
            className={classes.buttonFullWidth}
            onClick={() => {
              SubmitReadyForAnswer(id, userDetails!.ID);
            }}
          >
            {userHasDecided
              ? "waiting for others"
              : "ok cool, but who really did it?"}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
