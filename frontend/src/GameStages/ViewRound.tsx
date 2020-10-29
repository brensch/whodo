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
} from "../Api";
import { useRadioGroup } from "@material-ui/core";
import { ParamTypes, GamePageContext } from "../Pages/GamePage";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import RestoreIcon from "@material-ui/icons/Restore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LocationOnIcon from "@material-ui/icons/LocationOn";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  footer: {
    width: "100%",
    // position: "fixed",
    // bottom: 0,
    alignContent: "center",
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
  clues: {
    padding: 10,
    maxWidth: 1000,
    alignContent: "center",
  },
  cluesContainer: {
    // padding: 10,
    maxWidth: "100%",
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

  let cluesDiscoveredByPlayer: Clue[] = playerView.CharacterStory.CluesToReveal.filter(
    (clue) => {
      if (clue.Round === roundToViewName) {
        return (
          gameState.Clues.find((gameClue) => gameClue.Name === clue.Name) !==
          undefined
        );
      }
      return false;
    },
  );

  let finishedWithThisRound =
    gameState.FinishedRounds.find(
      (finishedRound) =>
        finishedRound.UserID === userDetails.ID &&
        finishedRound.Round == gameState.CurrentRound,
    ) !== undefined;

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <BottomNavigation
          // value={value}
          // onChange={(event, newValue) => {
          //   setValue(newValue);
          // }}
          showLabels
          className={classes.footer}
        >
          <BottomNavigationAction
            label="Recents"
            icon={<RestoreIcon />}
            onClick={() => console.log("yo")}
          />
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
        </BottomNavigation>
      </Grid>
    </Grid>
  );
  // return (
  //   <Grid container className={classes.root}>
  //     <Grid
  //       container
  //       className={classes.cluesContainer}
  //       // alignItems="center"
  //       // justify="center"
  //       spacing={2}
  //     >
  //       {/* <CluesModal />
  //           <TimelineModal />
  //           <NotesModal /> */}
  //       {/* {previousRound !== null ? (
  //           <Grid item xs={12}>
  //             <Button
  //               variant="contained"
  //               color="primary"
  //               className={classes.buttonFullWidth}
  //               onClick={() => setPreviousRound(null)}
  //             >
  //               return to current round info
  //             </Button>
  //           </Grid>
  //         ) : null} */}

  //       <Grid item xs={12}>
  //         <Typography variant="h4">
  //           {gameState.SelectedStory.Rounds[roundToView].Name}
  //         </Typography>
  //       </Grid>
  //       <Grid item xs={12}>
  //         <Typography>
  //           {gameState.SelectedStory.Rounds[roundToView].Intro}
  //         </Typography>
  //       </Grid>

  //       <Grid item xs={12}>
  //         <Paper variant="outlined">
  //           <Grid container>
  //             <Grid item xs={12}>
  //               <Typography variant="h6">tell people:</Typography>
  //             </Grid>
  //             {playerView.CharacterStory.InfoStates.filter(
  //               (info) => info.Public && info.Round == roundToViewName,
  //             ).map((info) => (
  //               <React.Fragment>
  //                 <Grid
  //                   item
  //                   xs={1}
  //                   onClick={() =>
  //                     ToggleInfoDone(
  //                       playerView.ID,
  //                       playerView.CharacterStory!.InfoStates,
  //                       info.Sequence,
  //                     )
  //                   }
  //                 >
  //                   {info.Done ? (
  //                     <CheckBoxIcon />
  //                   ) : (
  //                     <CheckBoxOutlineBlankIcon />
  //                   )}
  //                 </Grid>
  //                 <Grid item xs={11}>
  //                   <Typography align="left">{info.Content}</Typography>
  //                 </Grid>
  //               </React.Fragment>
  //             ))}
  //           </Grid>
  //         </Paper>
  //       </Grid>
  //       <Grid item xs={12}>
  //         <Paper variant="outlined">
  //           <Grid container>
  //             <Grid item xs={12}>
  //               <Typography variant="h6">keep secret:</Typography>
  //             </Grid>
  //             {playerView.CharacterStory.InfoStates.filter(
  //               (info) => !info.Public && info.Round == roundToViewName,
  //             ).map((info, i) => {
  //               return (
  //                 <React.Fragment>
  //                   <Grid
  //                     item
  //                     xs={1}
  //                     onClick={() =>
  //                       ToggleInfoDone(
  //                         playerView.ID,
  //                         playerView.CharacterStory!.InfoStates,
  //                         info.Sequence,
  //                       )
  //                     }
  //                   >
  //                     {info.Done ? (
  //                       <CheckBoxIcon />
  //                     ) : (
  //                       <CheckBoxOutlineBlankIcon />
  //                     )}
  //                   </Grid>
  //                   <Grid item xs={11}>
  //                     <Typography align="left">{info.Content}</Typography>
  //                   </Grid>
  //                 </React.Fragment>
  //               );
  //             })}
  //           </Grid>
  //         </Paper>
  //       </Grid>
  //       {cluesDiscoveredByPlayer.length > 0 ? (
  //         <Grid item xs={12}>
  //           <Paper variant="outlined">
  //             <Grid container>
  //               <Grid item xs={12}>
  //                 <Typography variant="h6">discovered a clue:</Typography>
  //               </Grid>
  //               {cluesDiscoveredByPlayer.map((clue, i) => (
  //                 <React.Fragment>
  //                   <Grid item xs={12}>
  //                     {clue.Description}
  //                   </Grid>
  //                   <Grid item xs={12} className={classes.padded}>
  //                     <Button
  //                       variant="contained"
  //                       color="primary"
  //                       className={classes.buttonFullWidth}
  //                       onClick={() => DiscoverClue(id, clue)}
  //                     >
  //                       reveal {clue.Name} to group
  //                     </Button>
  //                   </Grid>
  //                 </React.Fragment>
  //               ))}
  //             </Grid>
  //           </Paper>
  //         </Grid>
  //       ) : null}

  //       {previousRound === null && (
  //         <Grid item xs={12}>
  //           <Button
  //             variant="contained"
  //             color={!finishedWithThisRound ? "primary" : "secondary"}
  //             className={classes.buttonFullWidth}
  //             onClick={() => {
  //               console.log(finishedWithThisRound);
  //               if (!finishedWithThisRound) {
  //                 SetFinishedRound(id, gameState.CurrentRound, userDetails.ID);
  //                 return;
  //               }

  //               SetUnfinishedRound(id, gameState.CurrentRound, userDetails.ID);
  //             }}
  //           >
  //             <Grid
  //               container
  //               justify="center"
  //               alignItems="center"
  //               style={{ width: "100%" }}
  //             >
  //               {/* <Grid item xs={3}>
  //                   {finishedWithThisRound ? (
  //                     <CheckBoxIcon />
  //                   ) : (
  //                     <CheckBoxOutlineBlankIcon />
  //                   )}
  //                 </Grid> */}
  //               <Grid item xs={9}>
  //                 <Typography align="center">
  //                   {!finishedWithThisRound
  //                     ? "finished this round?"
  //                     : "finished. wait for others."}
  //                 </Typography>
  //               </Grid>
  //             </Grid>
  //           </Button>
  //         </Grid>
  //       )}
  //       {previousRound === null && (
  //         <Grid item xs={12}>
  //           {gameState.FinishedRounds.filter(
  //             (finished) => finished.Round === gameState.CurrentRound,
  //           ).length === gameState.UserIDs.length ? (
  //             <Button
  //               variant="contained"
  //               color="primary"
  //               className={classes.buttonFullWidth}
  //               onClick={() => SetRound(id, gameState.CurrentRound + 1)}
  //             >
  //               <Typography align="left"> next round</Typography>
  //             </Button>
  //           ) : (
  //             <Button
  //               variant="contained"
  //               color="primary"
  //               disabled
  //               className={classes.buttonFullWidth}
  //             >
  //               <Typography align="left"> not everyone ready yet</Typography>
  //             </Button>
  //           )}
  //         </Grid>
  //       )}
  //       {previousRound !== null && (
  //         <Grid item xs={12}>
  //           <Button
  //             variant="contained"
  //             color="primary"
  //             className={classes.buttonFullWidth}
  //             onClick={() => setPreviousRound(null)}
  //           >
  //             <Typography align="left"> go to current round</Typography>
  //           </Button>
  //         </Grid>
  //       )}
  //       {gameState.CurrentRound > 0 && (
  //         <Grid item xs={12}>
  //           <FormControl variant="outlined" className={classes.buttonFullWidth}>
  //             <InputLabel id="previous-round-label">
  //               check previous round clues
  //             </InputLabel>
  //             <Select
  //               labelId="previous-round-label"
  //               id="previous-round-select"
  //               value={previousRound}
  //               className={classes.buttonFullWidth}
  //               onChange={(e) => setPreviousRound(e.target.value as number)}
  //               label="check previous round info"
  //             >
  //               {gameState.SelectedStory.Rounds.filter(
  //                 (round, i) => i < gameState.CurrentRound,
  //               ).map((round, i) => (
  //                 <MenuItem value={i}>{round.Name}</MenuItem>
  //               ))}
  //             </Select>
  //           </FormControl>
  //         </Grid>
  //       )}
  //     </Grid>
  //     <Grid item xs={12}>
  //       <BottomNavigation
  //         // value={value}
  //         // onChange={(event, newValue) => {
  //         //   setValue(newValue);
  //         // }}
  //         showLabels
  //         className={classes.footer}
  //       >
  //         <BottomNavigationAction
  //           label="Recents"
  //           icon={<RestoreIcon />}
  //           onClick={() => console.log("yo")}
  //         />
  //         <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
  //         <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
  //       </BottomNavigation>
  //     </Grid>
  //   </Grid>
  // );
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
            <Grid
              container
              className={classes.root}
              spacing={2}
              alignItems="flex-start"
            >
              <Grid item xs={8}>
                <Typography variant="h4">clues</Typography>
              </Grid>
              <Grid container item xs={4} justify="flex-end">
                <IconButton
                  aria-label="close"
                  onClick={() => setCluesModal(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12}>
                <List component="nav" aria-label="clues list">
                  {gameState.DiscoveredClues.map((clue) => (
                    <ListItem
                      button
                      onClick={() => window.open(clue.URL, "_blank")}
                    >
                      <ListItemText primary={clue.Name} />
                    </ListItem>
                  ))}
                  {gameState.DiscoveredClues.length === 0 ? (
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
      <Grid item xs={4}>
        <Button
          variant="contained"
          color="primary"
          className={classes.buttonFullWidth}
          onClick={() => setCluesModal(true)}
        >
          <Typography align="center">clues</Typography>
        </Button>
      </Grid>
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
            <Grid
              container
              className={classes.root}
              spacing={2}
              alignItems="flex-start"
            >
              <Grid item xs={8}>
                <Typography variant="h4">timeline</Typography>
              </Grid>
              <Grid container item xs={4} justify="flex-end">
                <IconButton
                  aria-label="close"
                  onClick={() => setTimelineModal(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12}>
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
      <Grid item xs={4}>
        <Button
          variant="contained"
          color="primary"
          className={classes.buttonFullWidth}
          onClick={() => setTimelineModal(true)}
        >
          <Typography align="center">timeline</Typography>
        </Button>
      </Grid>
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
            <Grid
              container
              className={classes.root}
              spacing={2}
              alignItems="flex-start"
            >
              <Grid item xs={8}>
                <Typography variant="h4">notes</Typography>
              </Grid>
              <Grid container item xs={4} justify="flex-end">
                <IconButton
                  aria-label="close"
                  onClick={() => setNotesModal(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>

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
      <Grid item xs={4}>
        <Button
          variant="contained"
          color="primary"
          className={classes.buttonFullWidth}
          onClick={() => setNotesModal(true)}
        >
          <Typography align="center">notes</Typography>
        </Button>
      </Grid>
    </React.Fragment>
  );
};

// const RoundView = ({ game }) => {
//   const classes = useStyles();
//   const user = useContext(UserContext);
//   const [cluesModal, setCluesModal] = useState(false);
//   const [timelineModal, setTimelineModal] = useState(false);
//   const [notesModal, setNotesModal] = useState(false);
//   const [newNote, setNewNote] = useState("");
//   const [noteSubject, setNoteSubject] = useState("misc");
//   const [submittingNewNote, setSubmittingNewNote] = useState(false);
//   const [previousRound, setPreviousRound] = useState(null);
//   const [submittingClueDiscovery, setSubmittingClueDiscovery] = useState(false);

//   let roundToView = previousRound === null ? game.current_round : previousRound;

//   const nextRound = () => {
//     const current_round = game.current_round;
//     db.collection("games")
//       .doc(game.id)
//       .update({
//         current_round: current_round + 1,
//       });
//   };

//   const participant = game.participants[user.id];
//   const character = participant.character;

//   const updateNotes = (newNotes) => {
//     console.log(newNotes);
//     db.collection("games")
//       .doc(game.id)
//       .update({
//         [`participants.${user.id}.notes`]: newNotes,
//       });
//   };

//   const submitNewNote = () => {
//     setSubmittingNewNote(true);
//     db.collection("games")
//       .doc(game.id)
//       .update({
//         [`participants.${user.id}.generic_notes`]: firebase.firestore.FieldValue.arrayUnion(
//           {
//             message: newNote,
//             time: firebase.firestore.Timestamp.fromDate(new Date()),
//             subject: noteSubject,
//             round: game.current_round,
//           }
//         ),
//       })
//       .then(() => {
//         setNewNote("");
//         setSubmittingNewNote(false);
//       });
//   };

//   const discoverClue = (clueNumber) => {
//     setSubmittingClueDiscovery(true);
//     db.collection("games")
//       .doc(game.id)
//       .update({
//         discovered_clues: firebase.firestore.FieldValue.arrayUnion(clueNumber),
//       })
//       .then(() => {
//         setSubmittingClueDiscovery(false);
//       });
//   };

//   const clueSeen = (clueNumber) => {
//     db.collection("games")
//       .doc(game.id)
//       .update({
//         [`participants.${user.id}.seen_clues`]: firebase.firestore.FieldValue.arrayUnion(
//           clueNumber
//         ),
//       });
//   };

//   const cluesDiscoveredByPlayer = [];
//   game.story.clues.forEach((clue, i) => {
//     if (
//       clue.character === character.name &&
//       clue.round === game.current_round &&
//       !game.discovered_clues.includes(i)
//     ) {
//       cluesDiscoveredByPlayer.push({
//         id: i,
//         ...clue,
//       });
//     }
//   });

//   const unseenCluesArray = [];
//   game.discovered_clues.forEach((i) => {
//     if (!participant.seen_clues.includes(i)) {
//       unseenCluesArray.push(i);
//     }
//   });

//   return (
//     <React.Fragment>
//       <Modal
//         open={unseenCluesArray.length > 0}
//         className={classes.modal}
//         closeAfterTransition
//         BackdropComponent={Backdrop}
//         BackdropProps={{
//           timeout: 500,
//         }}
//       >
//         <Fade in={unseenCluesArray.length > 0}>
//           <div className={classes.modalPaper}>
//             <Grid
//               container
//               className={classes.root}
//               spacing={2}
//               alignItems="flex-start"
//             >
//               <Grid item xs={12}>
//                 <Typography variant="h4">new clue!</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <List component="nav" aria-label="clues list">
//                   {unseenCluesArray.map((clueNumber) => (
//                     <ListItem
//                       button
//                       onClick={() =>
//                         window.open(game.story.clues[clueNumber].url, "_blank")
//                       }
//                     >
//                       <ListItemText
//                         primary={game.story.clues[clueNumber].name}
//                         secondary="tap to view"
//                       />
//                       <ListItemSecondaryAction
//                         onClick={() => clueSeen(clueNumber)}
//                       >
//                         done
//                       </ListItemSecondaryAction>
//                     </ListItem>
//                   ))}
//                 </List>
//               </Grid>
//             </Grid>
//           </div>
//         </Fade>
//       </Modal>
//       <Modal
//         open={cluesModal}
//         onClose={() => setCluesModal(false)}
//         className={classes.modal}
//         closeAfterTransition
//         BackdropComponent={Backdrop}
//         BackdropProps={{
//           timeout: 500,
//         }}
//       >
//         <Fade in={cluesModal}>
//           <div className={classes.modalPaper}>
//             <Grid
//               container
//               className={classes.root}
//               spacing={2}
//               alignItems="flex-start"
//             >
//               <Grid item xs={8}>
//                 <Typography variant="h4">clues</Typography>
//               </Grid>
//               <Grid container item xs={4} justify="flex-end">
//                 <IconButton
//                   aria-label="close"
//                   onClick={() => setCluesModal(false)}
//                 >
//                   <CloseIcon />
//                 </IconButton>
//               </Grid>
//               <Grid item xs={12}>
//                 <List component="nav" aria-label="clues list">
//                   {game.discovered_clues.map((clueNumber) => (
//                     <ListItem
//                       button
//                       onClick={() =>
//                         window.open(game.story.clues[clueNumber].url, "_blank")
//                       }
//                     >
//                       <ListItemText
//                         primary={game.story.clues[clueNumber].name}
//                       />
//                     </ListItem>
//                   ))}
//                   {game.discovered_clues.length === 0 ? (
//                     <ListItem button>
//                       <ListItemText primary="no clues discovered yet" />
//                     </ListItem>
//                   ) : null}
//                 </List>
//               </Grid>
//             </Grid>
//           </div>
//         </Fade>
//       </Modal>
//       <Modal
//         open={timelineModal}
//         onClose={() => setTimelineModal(false)}
//         className={classes.modal}
//         closeAfterTransition
//         BackdropComponent={Backdrop}
//         BackdropProps={{
//           timeout: 500,
//         }}
//       >
//         <Fade in={timelineModal}>
//           <div className={classes.modalPaper}>
//             <Grid
//               container
//               className={classes.root}
//               spacing={2}
//               alignItems="flex-start"
//             >
//               <Grid item xs={8}>
//                 <Typography variant="h4">timeline</Typography>
//               </Grid>
//               <Grid container item xs={4} justify="flex-end">
//                 <IconButton
//                   aria-label="close"
//                   onClick={() => setTimelineModal(false)}
//                 >
//                   <CloseIcon />
//                 </IconButton>
//               </Grid>
//               <Grid item xs={12}>
//                 <TableContainer component={Paper}>
//                   <Table
//                     className={classes.table}
//                     size="small"
//                     aria-label="timeline-table"
//                   >
//                     <TableBody>
//                       {Object.keys(character.timeline)
//                         .sort()
//                         .map((time) => (
//                           <TableRow key={`timeline-${time}`}>
//                             <TableCell component="th" scope="row">
//                               {time}
//                             </TableCell>
//                             <TableCell align="right">
//                               {character.timeline[time]}
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </Grid>
//             </Grid>
//           </div>
//         </Fade>
//       </Modal>
//       <Modal
//         open={notesModal}
//         onClose={() => setNotesModal(false)}
//         className={classes.modal}
//         closeAfterTransition
//         BackdropComponent={Backdrop}
//         BackdropProps={{
//           timeout: 500,
//         }}
//       >
//         <Fade in={notesModal}>
//           <div className={classes.modalPaper}>
//             <Grid
//               container
//               className={classes.root}
//               spacing={2}
//               alignItems="flex-start"
//             >
//               <Grid item xs={8}>
//                 <Typography variant="h4">notes</Typography>
//               </Grid>
//               <Grid container item xs={4} justify="flex-end">
//                 <IconButton
//                   aria-label="close"
//                   onClick={() => setNotesModal(false)}
//                 >
//                   <CloseIcon />
//                 </IconButton>
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   value={newNote}
//                   id="new-note"
//                   label="new note"
//                   variant="outlined"
//                   className={classes.buttonFullWidth}
//                   onChange={(e) => {
//                     setNewNote(e.currentTarget.value);
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <FormControl
//                   variant="outlined"
//                   className={classes.buttonFullWidth}
//                 >
//                   <InputLabel id="note-subject-label">
//                     who's it about
//                   </InputLabel>
//                   <Select
//                     labelId="note-subject-label"
//                     id="note-subject-select"
//                     value={noteSubject}
//                     className={classes.buttonFullWidth}
//                     onChange={(e) => setNoteSubject(e.target.value)}
//                     label="who's it about "
//                   >
//                     {Object.values(game.participants).map((participant) => (
//                       <MenuItem value={participant.character.name}>
//                         {participant.character.name} ({participant.name})
//                       </MenuItem>
//                     ))}
//                     <MenuItem value="misc">misc</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   disabled={newNote === "" || submittingNewNote}
//                   className={classes.buttonFullWidth}
//                   onClick={() => submitNewNote()}
//                 >
//                   <Typography align="center">save note</Typography>
//                 </Button>
//               </Grid>
//               <Grid item xs={12}>
//                 <List className={classes.root}>
//                   {participant.generic_notes
//                     .sort((a, b) => {
//                       return b.time - a.time;
//                     })
//                     .map((note) => (
//                       <ListItem>
//                         <ListItemText
//                           primary={`${note.subject}: ${note.message}`}
//                           secondary={`${
//                             game.story.rounds[note.round].name
//                           }, ${note.time.toDate().toLocaleTimeString("en-AU")}`}
//                         />
//                       </ListItem>
//                     ))}
//                 </List>
//               </Grid>
//             </Grid>
//           </div>
//         </Fade>
//       </Modal>
//       <Grid container className={classes.root}>
//         <Grid container justify="center">
//           <Grid
//             container
//             className={classes.cluesContainer}
//             alignItems="center"
//             justify="center"
//             spacing={2}
//           >
//             <Grid item xs={4}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 className={classes.buttonFullWidth}
//                 onClick={() => setCluesModal(true)}
//               >
//                 <Typography align="center">clues</Typography>
//               </Button>
//             </Grid>
//             <Grid item xs={4}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 className={classes.buttonFullWidth}
//                 onClick={() => setTimelineModal(true)}
//               >
//                 <Typography align="center">timeline</Typography>
//               </Button>
//             </Grid>
//             <Grid item xs={4}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 className={classes.buttonFullWidth}
//                 onClick={() => setNotesModal(true)}
//               >
//                 <Typography align="center">notes</Typography>
//               </Button>
//             </Grid>
//             {previousRound !== null ? (
//               <Grid item xs={12}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   className={classes.buttonFullWidth}
//                   onClick={() => setPreviousRound(null)}
//                 >
//                   return to current round info
//                 </Button>
//               </Grid>
//             ) : null}

//             <Grid item xs={12}>
//               <Typography variant="h4">
//                 {game.story.rounds[roundToView].name}
//               </Typography>
//             </Grid>
//             <Grid item xs={12}>
//               <Typography>{game.story.rounds[roundToView].info}</Typography>
//             </Grid>
//             <Grid item xs={12}>
//               <Paper variant="outlined">
//                 <Grid container>
//                   <Grid item xs={12}>
//                     <Typography variant="h6">tell people:</Typography>
//                   </Grid>
//                   {character.info[roundToView].public.map((info, i) => {
//                     const newNotes = JSON.parse(
//                       JSON.stringify(participant.notes)
//                     );
//                     newNotes[roundToView].public[i] = !participant.notes[
//                       roundToView
//                     ].public[i];
//                     return (
//                       <React.Fragment>
//                         <Grid item xs={1} onClick={() => updateNotes(newNotes)}>
//                           {participant.notes[roundToView].public[i] ? (
//                             <CheckBoxIcon />
//                           ) : (
//                             <CheckBoxOutlineBlankIcon />
//                           )}
//                         </Grid>
//                         <Grid
//                           item
//                           xs={11}
//                           onClick={() => updateNotes(newNotes)}
//                         >
//                           <Typography align="left">{info}</Typography>
//                         </Grid>
//                       </React.Fragment>
//                     );
//                   })}
//                 </Grid>
//               </Paper>
//             </Grid>
//             <Grid item xs={12}>
//               <Paper variant="outlined">
//                 <Grid container>
//                   <Grid item xs={12}>
//                     <Typography variant="h6">keep secret:</Typography>
//                   </Grid>
//                   {character.info[roundToView].private.map((info, i) => {
//                     const newNotes = JSON.parse(
//                       JSON.stringify(participant.notes)
//                     );
//                     newNotes[roundToView].private[i] = !participant.notes[
//                       roundToView
//                     ].private[i];
//                     return (
//                       <React.Fragment>
//                         <Grid item xs={1} onClick={() => updateNotes(newNotes)}>
//                           {participant.notes[roundToView].private[i] ? (
//                             <CheckBoxIcon />
//                           ) : (
//                             <CheckBoxOutlineBlankIcon />
//                           )}{" "}
//                         </Grid>
//                         <Grid
//                           item
//                           xs={11}
//                           onClick={() => updateNotes(newNotes)}
//                         >
//                           <Typography align="left">{info}</Typography>
//                         </Grid>
//                       </React.Fragment>
//                     );
//                   })}
//                 </Grid>
//               </Paper>
//             </Grid>
//             {cluesDiscoveredByPlayer.length > 0 ? (
//               <Grid item xs={12}>
//                 <Paper variant="outlined">
//                   <Grid container>
//                     <Grid item xs={12}>
//                       <Typography variant="h6">discovered a clue:</Typography>
//                     </Grid>
//                     {cluesDiscoveredByPlayer.map((clue, i) => (
//                       <React.Fragment>
//                         <Grid item xs={12}>
//                           {clue.description}
//                         </Grid>
//                         <Grid item xs={12} className={classes.padded}>
//                           <Button
//                             variant="contained"
//                             color="primary"
//                             padding="3"
//                             className={classes.buttonFullWidth}
//                             onClick={() => discoverClue(clue.id)}
//                           >
//                             reveal {clue.name} to group
//                           </Button>
//                         </Grid>
//                       </React.Fragment>
//                     ))}
//                   </Grid>
//                 </Paper>
//               </Grid>
//             ) : null}

//             <Grid item xs={12}>
//               {previousRound === null ? (
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   className={classes.buttonFullWidth}
//                   onClick={() => {
//                     const newNotes = JSON.parse(
//                       JSON.stringify(participant.notes)
//                     );
//                     newNotes[roundToView].ready = !participant.notes[
//                       roundToView
//                     ].ready;
//                     return updateNotes(newNotes);
//                   }}
//                 >
//                   <Grid
//                     container
//                     justify="center"
//                     alignItems="center"
//                     style={{ width: "100%" }}
//                   >
//                     <Grid item xs={3}>
//                       {participant.notes[roundToView].ready ? (
//                         <CheckBoxIcon />
//                       ) : (
//                         <CheckBoxOutlineBlankIcon />
//                       )}
//                     </Grid>
//                     <Grid item xs={9}>
//                       <Typography align="left">done with this round</Typography>
//                     </Grid>
//                   </Grid>
//                 </Button>
//               ) : null}
//             </Grid>
//             <Grid item xs={12}>
//               {previousRound === null ? (
//                 Object.values(game.participants).filter((participant) => {
//                   return participant.notes[roundToView].ready;
//                 }).length === Object.values(game.participants).length ? (
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     className={classes.buttonFullWidth}
//                     onClick={() => nextRound()}
//                   >
//                     <Typography align="left"> next round</Typography>
//                   </Button>
//                 ) : (
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     disabled
//                     className={classes.buttonFullWidth}
//                   >
//                     <Typography align="left">
//                       {" "}
//                       not everyone ready yet
//                     </Typography>
//                   </Button>
//                 )
//               ) : null}
//             </Grid>
//             {game.current_round > 0 ? (
//               <Grid item xs={12}>
//                 <FormControl
//                   variant="outlined"
//                   className={classes.buttonFullWidth}
//                 >
//                   <InputLabel id="previous-round-label">
//                     check previous round clues
//                   </InputLabel>
//                   <Select
//                     labelId="previous-round-label"
//                     id="previous-round-select"
//                     value={previousRound}
//                     className={classes.buttonFullWidth}
//                     onChange={(e) => setPreviousRound(e.target.value)}
//                     label="check previous round info"
//                   >
//                     {game.story.rounds
//                       .filter((round, i) => i < game.current_round)
//                       .map((round, i) => (
//                         <MenuItem value={i}>{round.name}</MenuItem>
//                       ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//             ) : null}
//           </Grid>
//         </Grid>
//       </Grid>
//     </React.Fragment>
//   );
// };
