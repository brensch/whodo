import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { StateStoreContext } from "../Context";

const useStyles = makeStyles(() => ({
  optionsButtons: {
    minHeight: "70vh",
  },
  button: {
    width: "300px",
    textTransform: "none",
  },
}));

const StartPage = () => {
  let history = useHistory();
  const classes = useStyles();
  let { setHeaderText } = useContext(StateStoreContext);

  useEffect(() => setHeaderText(""), [setHeaderText]);

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
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => history.push("/create")}
          >
            schedule a game
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => history.push("/mygames")}
          >
            my games
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => history.push("/instructions")}
          >
            instructions
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            // variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => history.push("/options")}
          >
            options
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StartPage;
