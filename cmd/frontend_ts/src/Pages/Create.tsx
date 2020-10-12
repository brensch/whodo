import AppBar from "@material-ui/core/AppBar";
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Fade from "@material-ui/core/Fade";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CloseIcon from "@material-ui/icons/Close";
import HomeIcon from "@material-ui/icons/Home";
import InfoIcon from "@material-ui/icons/Info";
import Alert from "@material-ui/lab/Alert";
import { DateTimePicker } from "@material-ui/pickers";
import { formatDistance } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom";
import { useAuth, db, firebase, auth } from "../Firebase";
// import * as api from "../Firebase/Api";
import { Game } from "../Schema/Game";
import { StateStoreContext } from "../Context";
import { UserDetails } from "../Schema/User";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  button: {
    width: "300px",
    textTransform: "none",
  },
  optionsButtons: {
    minHeight: "70vh",
  },
}));

interface LocationState {
  from: {
    pathname: string;
  };
}

const datePickerTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      light: "#ba8fa4",
      main: "#ba8fa4",
      dark: "#8fbaba",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#ba8fa4",
    },
  },
  typography: {
    fontFamily: ["Lucida Console", "Monaco", "monospace"].join(","),
    fontSize: 13,
  },
});

const Create = () => {
  const classes = useStyles();

  const [name, setName] = useState("");
  const [selectedDate, handleDateChange] = useState<Date>(new Date());

  let history = useHistory();
  const { userDetails } = useContext(StateStoreContext);

  const createGame = () => {
    if (!!userDetails) {
      const newGame = new Game(userDetails);
      newGame
        .addToFirestore(name, selectedDate)
        .then((game) => history.push(`/game/${game.id}`));
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
            label="name your game"
            variant="outlined"
            className={classes.button}
            onChange={(e) => {
              setName(e.currentTarget.value);
            }}
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
              //   onChange={console.log}
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
      </Grid>
    </Container>
  );
};

export default Create;
