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
  listItem: {
    width: "300px",
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
  let { setSnackState } = useContext(StateStoreContext);
  const [stories, setStories] = useState<Array<StorySummary>>([]);
  const [modalStory, setModalStory] = useState<StorySummary | null>(null);

  useEffect(() => {
    const unsub = db
      .collection(STORY_SUMMARY_COLLECTION)
      .onSnapshot((snapshot) => {
        const allStories = snapshot.docs.map((doc) => {
          return (doc.data() as unknown) as StorySummary;
        });
        console.log(allStories);
        setStories(allStories);
      });
    return () => {
      unsub();
    };
  }, []);

  return (
    <React.Fragment>
      <Modal
        open={modalStory !== null}
        onClose={() => setModalStory(null)}
        className={classes.modal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalStory !== null}>
          <div className={classes.modalPaper}>
            <h2 id="story-modal-title">
              {modalStory !== null && modalStory.Metadata.Name}
            </h2>
            <p id="story-modal-description">
              {modalStory !== null && modalStory.Metadata.Blurb}
            </p>
          </div>
        </Fade>
      </Modal>
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
              {gameState.UserIDs.length} player
              {gameState.UserIDs.length > 1 && "s"}:
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {gameState.Users.map((user) => (
              <Typography align="center">{user.Name}</Typography>
            ))}
          </Grid>
          {/* <Grid item xs={12}>
          <Typography align="center">
            pick a story with {gameState.UserIDs.length} characters, or find
            more friends
          </Typography>
        </Grid> */}
          <Grid item xs={12}>
            <CopyToClipboard text={`${window.location.origin}/join/${id}`}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() =>
                  setSnackState({
                    severity: "info",
                    message: "invite link copied to clipboard",
                  })
                }
              >
                invite
              </Button>
            </CopyToClipboard>
          </Grid>

          <Grid item xs={12}>
            <List component="nav">
              {stories.map((story) => (
                <React.Fragment>
                  <Divider />
                  <ListItem
                    button
                    className={classes.listItem}
                    disabled={
                      gameState.UserIDs.length !== story.Characters.length
                    }
                    onClick={() => {
                      if (
                        gameState.UserIDs.length !== story.Characters.length
                      ) {
                        setSnackState({
                          severity: "info",
                          message:
                            "haven't invited enough people to play this game",
                        });
                        return;
                      }
                      SetGameStory(id, story).catch((err) =>
                        setSnackState({
                          severity: "error",
                          message: err.toString(),
                        }),
                      );
                    }}
                  >
                    <ListItemText
                      primary={story.Metadata.Name}
                      secondary={`${
                        story.Characters.length !== gameState.UserIDs.length
                          ? "need"
                          : ""
                      } ${story.Characters.length} players`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => setModalStory(story)}
                      >
                        <InfoIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </React.Fragment>
              ))}
              <Divider />
            </List>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};
