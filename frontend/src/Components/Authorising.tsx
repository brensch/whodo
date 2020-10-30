import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";

const useStyles = makeStyles(() => ({
  centeredObject: {
    minHeight: "70vh",
  },
}));

export default () => {
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
          <Typography>authorising</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};
