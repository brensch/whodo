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
import React, { useContext, useEffect, useState, createContext } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom";
import { useAuth, db, firebase } from "../Firebase";
// import * as api from "../Firebase/Api";
import { CharacterPick, GameState, PlayerView } from "../Schema/Game";
import { StateStoreContext } from "../Context";
import { UserDetails } from "../Schema/User";
import {
  StoryMetadata,
  STORY_SUMMARY_COLLECTION,
  Character,
} from "../Schema/Story";
import {
  ConnectGameState,
  ConnectPlayerView,
  PickCharacter,
  SetGameStory,
  SubmitReadyForAnswer,
} from "../Api";
import { useRadioGroup } from "@material-ui/core";
import { ParamTypes, GamePageContext } from "../Pages/GamePage";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  optionsButtons: {
    minHeight: "70vh",
  },
  button: {
    width: "300px",
    textTransform: "none",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: "80vh",
    overflow: "scroll",
  },
  clues: {
    padding: 10,
    maxWidth: 1000,
    alignContent: "center",
  },
  buttonFullWidth: {
    width: "100%",
    textTransform: "none",
  },
  correctGuess: {
    backgroundColor: "#0c540c",
    opacity: ".5",
  },
  incorrectGuess: {
    backgroundColor: "#540c0c",
    opacity: ".5",
  },
}));

export default () => {
  const classes = useStyles();
  let { id } = useParams<ParamTypes>();
  let { gameState } = useContext(GamePageContext);
  const { userDetails, userDetailsInitialising, setSnackState } = useContext(
    StateStoreContext,
  );
  let history = useHistory();

  let killer: string =
    gameState.Answers[gameState.Answers.length - 1].Character;

  return (
    <Container>
      <Grid container spacing={3} alignItems="stretch" direction="column">
        <Grid item xs={12}>
          <Typography align="center">
            {gameState.SelectedStory?.Metadata.Conclusion}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography align="center" variant="h6">
            how did everyone go?
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
              <Paper
                variant="outlined"
                className={
                  killer === guess.Killer
                    ? classes.correctGuess
                    : classes.incorrectGuess
                }
              >
                <Grid container className={classes.clues}>
                  <Grid item xs={12}>
                    <Typography variant="h5">
                      {guesserPick?.CharacterName} ({guesserUser?.Name}) -{" "}
                      {killer === guess.Killer ? "right!" : "wrong"}
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
            className={classes.buttonFullWidth}
            onClick={() => history.push("/create")}
          >
            play a different story
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttonFullWidth}
            onClick={() => history.push("/create")}
          >
            share
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttonFullWidth}
            onClick={() =>
              window.open("https://www.buymeacoffee.com/whodo", "_blank")
            }
          >
            buy me a coffee
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
