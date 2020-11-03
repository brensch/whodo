import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { DateTimePicker } from "@material-ui/pickers";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CreateGame } from "../Api";
import { baseThemeOptions } from "../Components";
import { StateStoreContext } from "../Context";

const useStyles = makeStyles(() => ({
  button: {
    width: "300px",
    textTransform: "none",
  },
  optionsButtons: {
    minHeight: "70vh",
  },
}));

// interface LocationState {
//   from: {
//     pathname: string;
//   };
// }

const datePickerTheme = createMuiTheme({
  ...baseThemeOptions,
  typography: {
    fontFamily: ["Lucida Console", "Monaco", "monospace"].join(","),
    fontSize: 13,
  },
});

const CreateGamePage = () => {
  const classes = useStyles();

  const [name, setName] = useState("");
  const [selectedDate, handleDateChange] = useState<Date>(new Date());

  let history = useHistory();
  const { userDetails, setHeaderText } = useContext(StateStoreContext);

  useEffect(() => setHeaderText("new game"), [setHeaderText]);

  const createGame = () => {
    if (!!userDetails) {
      CreateGame(name, selectedDate, userDetails).then((gameID) =>
        history.push(`/game/${gameID}`),
      );
    }
  };

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
          <TextField
            value={name}
            id="game-name"
            label="name your crew"
            variant="outlined"
            className={classes.button}
            onChange={(e) => {
              setName(e.currentTarget.value);
            }}
            inputProps={{ maxLength: 25 }}
          />
        </Grid>
        <Grid item xs={12}>
          <ThemeProvider theme={datePickerTheme}>
            <DateTimePicker
              fullWidth
              label="when are you playing?"
              inputVariant="outlined"
              className={classes.button}
              value={selectedDate}
              onChange={(event) => handleDateChange(event as Date)}
            />
          </ThemeProvider>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            disabled={name === ""}
            className={classes.button}
            onClick={() => createGame()}
          >
            create game
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" align="center">
            schedule for some point in the future to allow everyone to get
            costumes and prepare mentally
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateGamePage;
