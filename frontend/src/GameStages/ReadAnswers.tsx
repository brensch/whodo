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
import { StoryMetadata, STORY_SUMMARY_COLLECTION } from "../Schema/Story";
import {
  ConnectGameState,
  ConnectPlayerView,
  PickCharacter,
  RequestNextAnswer,
  SetGameStory,
} from "../Api";
import { useRadioGroup } from "@material-ui/core";
import { ParamTypes, GamePageContext } from "../Pages/GamePage";
import { Answer } from "../Schema/Story";

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
    padding: 30,
    maxWidth: 1000,
    alignContent: "center",
  },
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
  const { userDetails, userDetailsInitialising, setSnackState } = useContext(
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

  console.log(userAnswer);
  console.log(gameState.Answers.length);
  console.log(userAnswer !== undefined && userAnswer.Number);

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
