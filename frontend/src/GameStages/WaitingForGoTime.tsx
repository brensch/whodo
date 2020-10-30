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
import { GameState, PlayerView } from "../Schema/Game";
import { StateStoreContext } from "../Context";
import { UserDetails } from "../Schema/User";
import { StorySummary, STORY_SUMMARY_COLLECTION } from "../Schema/Story";
import {
  ConnectGameState,
  ConnectPlayerView,
  PickCharacter,
  SetGameStory,
  SetReadyToStart,
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
  buttonFullWidth: {
    width: "100%",
    textTransform: "none",
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: "80vh",
    overflow: "scroll",
  },
}));

export default () => {
  const classes = useStyles();
  let { id } = useParams<ParamTypes>();
  const { setSnackState, userDetails } = useContext(StateStoreContext);
  const [stories, setStories] = useState<Array<StorySummary>>([]);
  const [modalStory, setModalStory] = useState<StorySummary | null>(null);
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
