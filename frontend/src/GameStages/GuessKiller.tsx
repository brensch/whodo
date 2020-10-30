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
import { StoryMetadata, STORY_SUMMARY_COLLECTION } from "../Schema/Story";
import {
  ConnectGameState,
  ConnectPlayerView,
  PickCharacter,
  SetGameStory,
  SubmitGuess,
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
  fullWidth: {
    width: "100%",
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
}));

export default () => {
  const classes = useStyles();
  let { id } = useParams<ParamTypes>();
  let { gameState } = useContext(GamePageContext);
  const { userDetails, userDetailsInitialising, setSnackState } = useContext(
    StateStoreContext,
  );

  const [why, setWhy] = useState<string>("");
  const [killer, setKiller] = useState<string>("");

  // const SubmitGuess = () => {
  //   db.collection("games")
  //     .doc(game.id)
  //     .update({
  //       [`participants.${user.id}.guess`]: {
  //         killer: killer,
  //         why: why,
  //       },
  //     });
  // };

  return (
    <Container>
      <div className={classes.root}>
        <Grid container spacing={3} alignItems="stretch" direction="column">
          <Grid item xs={12}>
            <Typography variant="h6" align="center">
              ok, enough fun. time to guess whodo it and why.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <FormControl variant="outlined" className={classes.fullWidth}>
              <InputLabel id="killer-label">whodo</InputLabel>
              <Select
                labelId="killer-label"
                id="killer-select"
                value={killer}
                className={classes.fullWidth}
                onChange={(e) => setKiller(e.target.value as string)}
                label="whodo"
              >
                {gameState.CharacterPicks.map((pick) => {
                  const userName = gameState.Users.find(
                    (user) => user.ID === pick.UserID,
                  );
                  return (
                    <MenuItem value={pick.CharacterName}>
                      {pick.CharacterName} ({userName?.Name})
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={why}
              id="why"
              label="why"
              variant="outlined"
              className={classes.fullWidth}
              onChange={(e) => {
                setWhy(e.currentTarget.value);
              }}
              multiline
              rows={5}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              disabled={killer === "" || why === ""}
              className={classes.fullWidth}
              onClick={() => {
                SubmitGuess(id, userDetails!.ID, killer, why);
              }}
            >
              J'Accuse…!
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" align="center">
              if you're not sure, just write something funny about one of the
              players.
            </Typography>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};
