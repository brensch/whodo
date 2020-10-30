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
import { Clue, StoryMetadata, STORY_SUMMARY_COLLECTION } from "../Schema/Story";
import {
  ConnectGameState,
  ConnectPlayerView,
  DiscoverClue,
  PickCharacter,
  SetFinishedRound,
  SetUnfinishedRound,
  SetGameStory,
  ToggleInfoDone,
  SetRound,
  TakeNote,
  RevealClue,
  MarkClueSeen,
} from "../Api";
import { TableHead, useRadioGroup } from "@material-ui/core";
import { ParamTypes, GamePageContext } from "../Pages/GamePage";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import RestoreIcon from "@material-ui/icons/Restore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import SearchIcon from "@material-ui/icons/Search";
import NotesIcon from "@material-ui/icons/Notes";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  footer: {
    width: "100%",
    position: "fixed",
    bottom: 0,
    // alignContent: "center",
    // backgroundColor: "transparent",
  },
  optionsButtons: {
    minHeight: "70vh",
  },
  button: {
    width: "300px",
    textTransform: "none",
  },
  padded: {
    padding: "10px",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    flexGrow: 1,
  },
  modalClose: {
    padding: 0,
  },
  clues: {
    padding: 10,
    maxWidth: 1000,
    alignContent: "center",
  },
  cluesContainer: {
    // padding: 10,
    maxWidth: "100%",
    padding: 2,
  },
  buttonFullWidth: {
    width: "100%",
    textTransform: "none",
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 1, 3),
    maxHeight: "80vh",
    maxWidth: "90%",
    overflow: "auto",
  },
  table: {},
  test: {
    width: "100%",
    height: "100px",
    backgroundColor: "red",
  },
  divider: {
    height: "10px",
  },
  timelineDivider: {
    width: "100%",
  },
  infoBoxes: {
    padding: 5,
  },
}));

export default () => {
  const classes = useStyles();
  let { id } = useParams<ParamTypes>();
  let { gameState, playerView } = useContext(GamePageContext);
  const { userDetails, userDetailsInitialising, setSnackState } = useContext(
    StateStoreContext,
  );
  const [previousRound, setPreviousRound] = useState<number | null>(null);

  if (
    userDetails === null ||
    userDetailsInitialising ||
    gameState.SelectedStory === null ||
    playerView.CharacterStory === null ||
    gameState.CurrentRound >= gameState.SelectedStory.Rounds.length
  ) {
    return null;
  }

  let roundToView =
    previousRound === null ? gameState.CurrentRound : previousRound;

  // info objects are mapped to string (easier in spreadsheet)
  let roundToViewName = gameState.SelectedStory.Rounds[roundToView].Name;

  let finishedWithThisRound =
    gameState.FinishedRounds.find(
      (finishedRound) =>
        finishedRound.UserID === userDetails.ID &&
        finishedRound.Round == gameState.CurrentRound,
    ) !== undefined;

  return (
    <React.Fragment>
      <UnseenClueModal />
      <Container>
        <div className={classes.root}>
          <Grid
            container
            spacing={2}
            // justify="center"
            alignItems="stretch"
            direction="column"
          >
            <Grid item xs={12}>
              <Typography variant="h4">
                {gameState.SelectedStory.Rounds[roundToView].Name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                {gameState.SelectedStory.Rounds[roundToView].Intro}
              </Typography>
            </Grid>
            <CluesToReveal />
            <Grid item xs={12}>
              <Paper variant="outlined" className={classes.infoBoxes}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="h6">tell people:</Typography>
                  </Grid>
                  {playerView.CharacterStory.InfoStates.filter(
                    (info) => info.Public && info.Round == roundToViewName,
                  ).map((info) => (
                    <React.Fragment>
                      <Grid
                        item
                        xs={1}
                        onClick={() =>
                          ToggleInfoDone(
                            playerView.ID,
                            playerView.CharacterStory!.InfoStates,
                            info.Sequence,
                          )
                        }
                      >
                        {info.Done ? (
                          <CheckBoxIcon />
                        ) : (
                          <CheckBoxOutlineBlankIcon />
                        )}
                      </Grid>
                      <Grid item xs={11}>
                        <Typography align="left">{info.Content}</Typography>
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper variant="outlined" className={classes.infoBoxes}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="h6">keep secret:</Typography>
                  </Grid>
                  {playerView.CharacterStory.InfoStates.filter(
                    (info) => !info.Public && info.Round == roundToViewName,
                  ).map((info, i) => {
                    return (
                      <React.Fragment>
                        <Grid
                          item
                          xs={1}
                          onClick={() =>
                            ToggleInfoDone(
                              playerView.ID,
                              playerView.CharacterStory!.InfoStates,
                              info.Sequence,
                            )
                          }
                        >
                          {info.Done ? (
                            <CheckBoxIcon />
                          ) : (
                            <CheckBoxOutlineBlankIcon />
                          )}
                        </Grid>
                        <Grid item xs={11}>
                          <Typography align="left">{info.Content}</Typography>
                        </Grid>
                      </React.Fragment>
                    );
                  })}
                </Grid>
              </Paper>
            </Grid>
            {previousRound === null && (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color={!finishedWithThisRound ? "primary" : "secondary"}
                  className={classes.buttonFullWidth}
                  onClick={() => {
                    if (!finishedWithThisRound) {
                      SetFinishedRound(
                        id,
                        gameState.CurrentRound,
                        userDetails.ID,
                      );
                      return;
                    }

                    SetUnfinishedRound(
                      id,
                      gameState.CurrentRound,
                      userDetails.ID,
                    );
                  }}
                >
                  <Typography align="center">
                    {!finishedWithThisRound
                      ? "finished this round?"
                      : "finished. wait for others."}
                  </Typography>
                </Button>
              </Grid>
            )}
            {previousRound === null && (
              <Grid item xs={12}>
                {gameState.FinishedRounds.filter(
                  (finished) => finished.Round === gameState.CurrentRound,
                ).length === gameState.UserIDs.length ? (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.buttonFullWidth}
                    onClick={() => SetRound(id, gameState.CurrentRound + 1)}
                  >
                    <Typography align="left"> next round</Typography>
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    disabled
                    className={classes.buttonFullWidth}
                  >
                    <Typography align="left">
                      {" "}
                      not everyone ready yet
                    </Typography>
                  </Button>
                )}
              </Grid>
            )}
            {previousRound !== null && (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.buttonFullWidth}
                  onClick={() => setPreviousRound(null)}
                >
                  <Typography align="left"> go to current round</Typography>
                </Button>
              </Grid>
            )}
            {gameState.CurrentRound > 0 && (
              <Grid item xs={12}>
                <FormControl
                  variant="outlined"
                  className={classes.buttonFullWidth}
                >
                  <InputLabel id="previous-round-label">
                    check previous round clues
                  </InputLabel>
                  <Select
                    labelId="previous-round-label"
                    id="previous-round-select"
                    value={previousRound}
                    className={classes.buttonFullWidth}
                    onChange={(e) => setPreviousRound(e.target.value as number)}
                    label="check previous round info"
                  >
                    {gameState.SelectedStory.Rounds.filter(
                      (round, i) => i < gameState.CurrentRound,
                    ).map((round, i) => (
                      <MenuItem value={i}>{round.Name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </div>
      </Container>
      <BottomNavigation className={classes.footer}>
        <CluesModal />
        <NotesModal />
        <TimelineModal />
      </BottomNavigation>
    </React.Fragment>
  );
};

const UnseenClueModal = () => {
  const classes = useStyles();
  let { gameState, playerView } = useContext(GamePageContext);
  let { id } = useParams<ParamTypes>();

  let unseenClues = gameState.Clues.filter(
    (clue) => !playerView.CluesSeen.includes(clue.Name),
  );

  return (
    <Modal
      open={unseenClues.length > 0}
      className={classes.modal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={unseenClues.length > 0}>
        <div className={classes.modalPaper}>
          <Grid
            container
            className={classes.root}
            spacing={2}
            alignItems="flex-start"
          >
            <Grid item xs={12}>
              <Typography variant="h4">new clue!</Typography>
            </Grid>
            <Grid item xs={12}>
              <List component="nav" aria-label="clues list">
                {unseenClues.map((clue) => (
                  <ListItem
                    button
                    onClick={() => window.open(clue.URL, "_blank")}
                  >
                    <ListItemText primary={clue.Name} secondary="tap to view" />
                    <ListItemSecondaryAction
                      onClick={() => MarkClueSeen(playerView.ID, clue)}
                    >
                      done
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </div>
      </Fade>
    </Modal>
  );
};

const CluesToReveal = () => {
  const classes = useStyles();
  let { gameState, playerView } = useContext(GamePageContext);
  let { id } = useParams<ParamTypes>();

  const [cluesModal, setCluesModal] = useState<boolean>(false);

  if (gameState.SelectedStory === null || playerView.CharacterStory === null) {
    return null;
  }

  let roundName = gameState.SelectedStory.Rounds[gameState.CurrentRound].Name;

  let cluesDiscoveredThisRound = playerView.CharacterStory.CluesToReveal.filter(
    (clue) => clue.Round === roundName,
  ).filter((clue) => !playerView.CluesSeen.includes(clue.Name));

  if (cluesDiscoveredThisRound.length === 0) {
    return null;
  }

  return (
    <Grid item xs={12}>
      <Paper variant="outlined" className={classes.infoBoxes}>
        <Grid container spacing={2} alignItems="stretch" direction="column">
          <Grid item xs={12}>
            <Typography variant="h6">you discovered a clue!</Typography>
          </Grid>
          {cluesDiscoveredThisRound.map((clue) => (
            <React.Fragment>
              <Grid item xs={12}>
                {clue.Description}
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color={"primary"}
                  className={classes.buttonFullWidth}
                  onClick={() => RevealClue(id, clue)}
                >
                  reveal {clue.Name} to group
                </Button>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Paper>
    </Grid>
  );
};

const CluesModal = () => {
  const classes = useStyles();
  let { gameState, playerView } = useContext(GamePageContext);

  const [cluesModal, setCluesModal] = useState<boolean>(false);

  return (
    <React.Fragment>
      <Modal
        open={cluesModal}
        onClose={() => setCluesModal(false)}
        className={classes.modal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={cluesModal}>
          <div className={classes.modalPaper}>
            <AppBar position="static" color="inherit">
              <Toolbar>
                <Typography variant="h6" className={classes.modalTitle}>
                  clues
                </Typography>
                <IconButton
                  aria-label="close"
                  onClick={() => setCluesModal(false)}
                  className={classes.modalClose}
                >
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Grid
              container
              className={classes.root}
              spacing={2}
              alignItems="flex-start"
            >
              <Grid item xs={12}>
                <List component="nav" aria-label="clues list">
                  {gameState.Clues.map((clue) => (
                    <ListItem
                      button
                      onClick={() => window.open(clue.URL, "_blank")}
                    >
                      <ListItemText primary={clue.Name} />
                    </ListItem>
                  ))}
                  {gameState.Clues.length === 0 ? (
                    <ListItem button>
                      <ListItemText primary="no clues discovered yet" />
                    </ListItem>
                  ) : null}
                </List>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
      <BottomNavigationAction
        label="clues"
        showLabel
        icon={<SearchIcon />}
        onClick={() => setCluesModal(true)}
      />
    </React.Fragment>
  );
};

const TimelineModal = () => {
  const classes = useStyles();
  let { gameState, playerView } = useContext(GamePageContext);

  const [timelineModal, setTimelineModal] = useState<boolean>(false);

  return (
    <React.Fragment>
      <Modal
        open={timelineModal}
        onClose={() => setTimelineModal(false)}
        className={classes.modal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={timelineModal}>
          <div className={classes.modalPaper}>
            <AppBar position="static" color="inherit">
              <Toolbar>
                <Typography variant="h6" className={classes.modalTitle}>
                  timeline
                </Typography>
                <IconButton
                  aria-label="close"
                  onClick={() => setTimelineModal(false)}
                  className={classes.modalClose}
                >
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="flex-start"
            >
              <Grid item xs={12}>
                <Divider className={classes.timelineDivider} />
                <TableContainer component={Paper}>
                  <Table
                    className={classes.table}
                    size="small"
                    aria-label="timeline-table"
                  >
                    <TableBody>
                      {playerView.CharacterStory?.TimelineEvents.sort((a, b) =>
                        a.Time < b.Time ? 1 : -1,
                      ).map((event) => (
                        <TableRow key={`timeline-${event.Time}`}>
                          <TableCell component="th" scope="row">
                            {event.Time}
                          </TableCell>
                          <TableCell align="right">{event.Event}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
      <BottomNavigationAction
        label="timeline"
        showLabel
        icon={<AccessTimeIcon />}
        onClick={() => setTimelineModal(true)}
      />
    </React.Fragment>
  );
};

const NotesModal = () => {
  const classes = useStyles();
  let { gameState, playerView } = useContext(GamePageContext);
  let { setSnackState } = useContext(StateStoreContext);
  const [notesModal, setNotesModal] = useState<boolean>(false);
  const [newNote, setNewNote] = useState<string>("");
  const [noteSubject, setNoteSubject] = useState<string>("");
  const [uploadingNote, setUploadingNote] = useState<boolean>(false);

  return (
    <React.Fragment>
      <Modal
        open={notesModal}
        onClose={() => setNotesModal(false)}
        className={classes.modal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={notesModal}>
          <div className={classes.modalPaper}>
            <AppBar position="static" color="inherit">
              <Toolbar>
                <Typography variant="h6" className={classes.modalTitle}>
                  notes
                </Typography>
                <IconButton
                  aria-label="close"
                  onClick={() => setNotesModal(false)}
                  className={classes.modalClose}
                >
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Grid
              container
              className={classes.root}
              spacing={2}
              alignItems="flex-start"
            >
              <Grid item xs={12}>
                <TextField
                  value={newNote}
                  id="new-note"
                  label="new note"
                  variant="outlined"
                  className={classes.buttonFullWidth}
                  onChange={(e) => {
                    setNewNote(e.currentTarget.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  variant="outlined"
                  className={classes.buttonFullWidth}
                >
                  <InputLabel id="note-subject-label">
                    who's it about
                  </InputLabel>
                  <Select
                    labelId="note-subject-label"
                    id="note-subject-select"
                    value={noteSubject}
                    className={classes.buttonFullWidth}
                    onChange={(e) => setNoteSubject(e.target.value as string)}
                    label="who's it about "
                  >
                    {gameState.CharacterPicks.map((pick) => {
                      const userName = gameState.Users.find(
                        (user) => (user.ID = pick.UserID),
                      );
                      return (
                        <MenuItem value={pick.CharacterName}>
                          {pick.CharacterName} ({userName?.Name})
                        </MenuItem>
                      );
                    })}
                    <MenuItem value="misc">misc</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={
                    newNote === "" || noteSubject === "" || uploadingNote
                  }
                  className={classes.buttonFullWidth}
                  onClick={() => {
                    setUploadingNote(true);
                    TakeNote(
                      playerView.ID,
                      gameState.CurrentRound,
                      noteSubject,
                      newNote,
                    )
                      .then(() => {
                        setNoteSubject("");
                        setNewNote("");
                      })
                      .catch((err) =>
                        setSnackState({
                          severity: "error",
                          message: err.toString(),
                        }),
                      )
                      .finally(() => setUploadingNote(false));
                  }}
                >
                  <Typography align="center">save note</Typography>
                </Button>
              </Grid>
              <Grid item xs={12}>
                <List className={classes.root}>
                  {playerView.Notes.sort((a, b) =>
                    a.Time < b.Time ? 1 : -1,
                  ).map((note) => (
                    <ListItem>
                      <ListItemText
                        primary={`${note.AboutCharacter}: ${note.Message}`}
                        secondary={`${
                          gameState.SelectedStory?.Rounds[note.Round].Name
                        }, ${note.Time.toDate().toLocaleTimeString("en-AU")}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
      <BottomNavigationAction
        label="notes"
        showLabel
        icon={<NotesIcon />}
        onClick={() => setNotesModal(true)}
      />
    </React.Fragment>
  );
};
