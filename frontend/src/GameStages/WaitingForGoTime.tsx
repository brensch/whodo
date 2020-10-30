import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { formatDistance } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SetReadyToStart } from "../Api";
import { StateStoreContext } from "../Context";
import { GamePageContext, ParamTypes } from "../Pages/GamePage";

const useStyles = makeStyles(() => ({
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
  let { id } = useParams<ParamTypes>();
  const { userDetails } = useContext(StateStoreContext);
  const { gameState, playerView } = useContext(GamePageContext);

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (playerView.CharacterStory === null) {
    return (
      <div>
        the cloud is working hard to retrieve your top secret clues. Please be
        patient, it's hard being a cloud.
      </div>
    );
  }

  if (userDetails === null) {
    return null;
  }

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
          <Typography align="center">
            alright time to get ready. go get a costume before the game starts.
            <br />
            you'll be playing:
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            {playerView.CharacterStory.Character.Name}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography align="center">
            {playerView.CharacterStory.Character.Blurb}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            time until the fun begins:
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            {formatDistance(gameState.StartTime.toDate(), now)}
          </Typography>
        </Grid>
        {!gameState.ReadyToStart.includes(userDetails.ID) && (
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              className={classes.buttonFullWidth}
              onClick={() => {
                SetReadyToStart(id, userDetails?.ID);
              }}
            >
              i want to start now
            </Button>
          </Grid>
        )}
        {gameState.ReadyToStart.length > 0 ? (
          <Grid item xs={12}>
            <Typography align="center">
              There are some users already ready to start:{" "}
              {gameState.ReadyToStart.map((readyID) => {
                const readyUser = gameState.Users.find(
                  (user) => user.ID === readyID,
                );
                return `${readyUser?.Name},`;
              })}
            </Typography>
          </Grid>
        ) : null}
      </Grid>
    </Container>
  );
};
