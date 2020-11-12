import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  centeredObject: {
    minHeight: "70vh",
  },
  button: {
    width: "100%",
    textTransform: "none",
  },
}));

const SplashPage = () => {
  let history = useHistory();
  const classes = useStyles();

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
          <Typography variant="h4">welcome to who why how</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" align="center">
            a totally excellent online murder mystery experience. can you figure
            out who why how?
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => history.push("/")}
          >
            let's go
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SplashPage;
