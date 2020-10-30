import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useContext } from "react";
import { StateStoreContext } from "../Context";
import { GamePageContext } from "../Pages/GamePage";

const useStyles = makeStyles(() => ({
  optionsButtons: {
    minHeight: "70vh",
  },
}));

export default () => {
  const classes = useStyles();
  let { gameState } = useContext(GamePageContext);
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
    <React.Fragment>
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
            <Typography>
              wait for everyone to choose the killer. i'm excited, are you?
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};
