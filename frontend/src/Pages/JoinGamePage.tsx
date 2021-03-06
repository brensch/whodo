import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useContext, useEffect, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { AddUserToGame, ConnectGameState } from "../Api";
import Loading from "../Components/Loading";
import { StateStoreContext } from "../Context";
import { GameState } from "../Schema/Game";

const useStyles = makeStyles(() => ({
  button: {
    width: "100%",
    textTransform: "none",
  },
  fullWidth: {
    width: "100%",
  },
  centeredObject: {
    minHeight: "70vh",
  },
}));

interface ParamTypes {
  id: string;
}

const JoinGamePage = () => {
  const classes = useStyles();
  let history = useHistory();
  let { id } = useParams<ParamTypes>();
  const [gameState, setGameState] = useState<GameState | null | undefined>(
    null,
  );
  let { userDetails, setSnackState, setHeaderText } = useContext(
    StateStoreContext,
  );

  useEffect(() => setHeaderText("invitation"), [setHeaderText]);

  useEffect(() => {
    if (userDetails !== null) {
      try {
        ConnectGameState(id, setGameState);
      } catch (err) {
        setSnackState({
          severity: "error",
          message: err.toString(),
        });
      }
    }
  }, [userDetails, id, setSnackState]);

  if (gameState === null) {
    return <Loading />;
  }

  if (gameState === undefined) {
    return <div>invalid gameState, check url</div>;
  }

  // if user has already joined redirect to actual gameState
  if (userDetails !== null && gameState.UserIDs.includes(userDetails.ID)) {
    return <Redirect to={`/game/${id}`} />;
  }

  if (gameState.Locked) {
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
            <Typography>
              bother, this game has already started. looks like your friends
              don't like you enough to wait for you to join the game.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <React.Fragment>
      <Container>
        <Grid container spacing={3} alignItems="stretch" direction="column">
          <Grid item xs={12}>
            <Typography align={"center"} variant="h6">
              you've been invited to a murder mystery:
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              className={classes.fullWidth}
              align={"center"}
            >
              {gameState.Name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => {
                if (userDetails !== null) {
                  return AddUserToGame(id, userDetails).then(() =>
                    history.push(`/game/${id}`),
                  );
                }
              }}
            >
              join game
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography align={"center"}>current players:</Typography>
          </Grid>
          <Grid item xs={12}>
            {gameState.Users.map((userDetails) => (
              <Typography align="center">{userDetails.Name}</Typography>
            ))}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default JoinGamePage;
