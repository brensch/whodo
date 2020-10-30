import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { RequestNextAnswer } from "../Api";
import { StateStoreContext } from "../Context";
import { GamePageContext, ParamTypes } from "../Pages/GamePage";
import { Answer } from "../Schema/Story";

const useStyles = makeStyles(() => ({
  buttonFullWidth: {
    width: "100%",
    textTransform: "none",
  },
  centeredObject: {
    minHeight: "70vh",
  },
}));

export default () => {
  const classes = useStyles();
  let { id } = useParams<ParamTypes>();
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

  let userAnswer: Answer | undefined = gameState.Answers.find(
    (answer) => answer.Character === playerView.CharacterStory?.Character.Name,
  );

  if (
    userAnswer === undefined ||
    gameState.Answers.length > userAnswer.Number + 1
  ) {
    return (
      <Container>
        <Grid
          container
          spacing={3}
          justify="center"
          alignItems="center"
          direction="column"
          className={classes.centeredObject}
        >
          <Grid item xs={12}>
            <Typography align={"center"}>
              someone else is reading their answer.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography align={"center"}>listen patiently.</Typography>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={3} alignItems="stretch" direction="column">
        <Grid item xs={12}>
          <Typography variant="h5">
            read to the group. they're all listening:
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">{userAnswer.Details}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            disabled={playerView.ReadAnswer}
            className={classes.buttonFullWidth}
            onClick={() =>
              RequestNextAnswer(id, playerView.ID, userAnswer!.Number + 1)
            }
          >
            finished reading
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
