import React, { useState, useEffect, useContext } from "react"; // update
import { firebase, db, auth } from "./firebase";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import SettingsIcon from "@material-ui/icons/Settings";
import WorkIcon from "@material-ui/icons/Work";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import InfoIcon from "@material-ui/icons/Info";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { DateTimePicker } from "@material-ui/pickers";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { formatDistance } from "date-fns";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Divider from "@material-ui/core/Divider";
import CloseIcon from "@material-ui/icons/Close";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory,
  useLocation,
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(0),
  },
  title: {
    flexGrow: 1,
  },
  button: {
    width: "300px",
    textTransform: "none",
  },
  buttonFullWidth: {
    width: "100%",
    textTransform: "none",
  },
  padded: {
    padding: "10px",
  },

  optionsButtons: {
    minHeight: "70vh",
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  clues: {
    padding: 10,
    maxWidth: 1000,
    alignContent: "center",
  },
  cluesContainer: {
    padding: 10,
    maxWidth: 1000,
  },
  notesPopup: {},
  cluesGrid: {
    display: "flex",
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

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const UserContext = React.createContext();

export default () => {
  const classes = useStyles();

  let history = useHistory();
  let location = useLocation();
  const [authUser, setAuthUser] = useState("loading");
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState(false);
  const [userDetails, setUserDetails] = useState("loading");
  const [err, setErr] = useState(null);
  let target = useQuery().get("target");

  useEffect(() => {
    const unlisten = auth.onAuthStateChanged((authUserChange) => {
      console.log(authUserChange);
      authUserChange ? setAuthUser(authUserChange) : setAuthUser(null);
    });
    return () => {
      unlisten();
    };
  });

  useEffect(() => {
    if (userDetails !== null) {
      setNewUser(false);
    }
  }, [userDetails]);

  useEffect(() => {
    console.log("authuser", authUser);
    if (authUser !== "loading" && authUser !== null) {
      // setLoading(true);
      console.log(authUser);
      db.collection("user_details")
        .doc(authUser.uid)
        .get()
        .then((results) => {
          console.log(results);
          if (results.exists) {
            setUserDetails(results.data());
          } else {
            setNewUser(true);
          }
        })
        .catch((err) => setErr(err.toString()));
      // .finally(() => setLoading(false));
    }
    // setLoading(false);
  }, [authUser]);

  if (newUser) {
    // console.log(authUser, userDetails, loading);
    return <ChooseName setUserDetails={setUserDetails} />;
  }

  // if not authed, direct to signin
  if (
    location.pathname !== "/signin" &&
    location.pathname !== "/signup" &&
    authUser === null
  ) {
    console.log("signing in");
    history.push(`/signin?target=${location.pathname}`);
  }

  // if authed while on auth page, redirect to original target
  if (
    (location.pathname === "/signin" || location.pathname === "/signup") &&
    authUser !== null
  ) {
    history.push(`${target}`);
  }

  if (err !== null) {
    return <div>error: {err}</div>;
  }

  if (
    location.pathname !== "/signin" &&
    location.pathname !== "/signup" &&
    userDetails === "loading"
  ) {
    return <div>loading</div>;
  }
  // if authed but no userDetails, show name select page

  return (
    <div className={classes.root}>
      <UserContext.Provider value={userDetails}>
        <Banner />
        <Switch>
          <Route path="/create">
            <Create />
          </Route>
          <Route path="/join/:id">
            <Join />
          </Route>
          <Route path="/game/:id">
            <Game />
          </Route>
          <Route path="/mygames">
            <MyGames />
          </Route>
          <Route path="/signin">
            <SignIn />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/options">
            <Options />
          </Route>
          <Route path="/instructions">
            <Instructions />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </UserContext.Provider>
    </div>
  );
};

const MyGames = () => {
  const user = useContext(UserContext);
  const [games, setGames] = useState([]);
  const classes = useStyles();
  let history = useHistory();

  console.log(user);

  useEffect(() => {
    // if
    const unsub = db
      .collection("games")
      .where("participant_ids", "array-contains", user.id)
      .onSnapshot((snapshot) => {
        const allGames = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGames(allGames);
      });
    return () => {
      unsub();
    };
  }, []);

  return (
    <React.Fragment>
      <Typography align="center">your games</Typography>
      <List
        component="nav"
        aria-labelledby="games-list"
        className={classes.root}
      >
        {games.map((game) => (
          <ListItem button onClick={() => history.push("/game/" + game.id)}>
            <ListItemText
              primary={`${game.name} - ${game.participant_ids.length} players`}
              secondary={game.story !== null && game.story.name}
            />
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );
};

const ChooseName = ({ setUserDetails }) => {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [err, setErr] = useState(null);
  let history = useHistory();
  let query = useQuery();

  let target = query.get("target");

  const SelectName = () => {
    const userDetails = {
      id: auth.currentUser.uid,
      name: name,
      email: auth.currentUser.email,
    };
    db.collection("user_details")
      .doc(auth.currentUser.uid)
      .set(userDetails)
      .then(() => setUserDetails(userDetails))
      .catch((err) => setErr(err.toString()));
  };

  return (
    <Grid
      container
      spacing={3}
      justify="center"
      alignItems="center"
      direction="column"
      className={classes.optionsButtons}
    >
      <Snackbar
        open={err !== null}
        autoHideDuration={6000}
        onClose={() => setErr(null)}
      >
        <Alert onClose={() => setErr(null)} severity="error">
          {err}
        </Alert>
      </Snackbar>
      <Grid item xs={12}>
        <Typography>pick a hilarious yet identifiable name</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={name}
          id="name"
          label="name"
          variant="outlined"
          className={classes.button}
          onChange={(e) => {
            setName(e.currentTarget.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => SelectName()}
        >
          choose this cool name
        </Button>
      </Grid>
    </Grid>
  );
};

const Banner = () => {
  const classes = useStyles();
  let history = useHistory();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="home-button"
            onClick={() => history.push("/")}
          >
            <HomeIcon />
          </IconButton>
          <Typography
            onClick={() => history.push("/")}
            variant="h6"
            className={classes.title}
          >
            who-do
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

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

    // htmlFontSize: 6,

    // fontFamily: ["Courier New", "Courier", "monospace"].join(","),
    // fontFamily: ["Times New Roman", "Times", "serif"].join(","),
  },
});

const Create = () => {
  const classes = useStyles();

  const [name, setName] = useState("");
  const [selectedDate, handleDateChange] = useState(new Date());

  let history = useHistory();
  const user = useContext(UserContext);

  const createGame = () => {
    console.log(selectedDate);
    db.collection("games")
      .add({
        name: name,
        participants_locked: false,
        discovered_clues: [],
        story: null,
        current_round: 0,
        current_answer: 0,
        participant_ids: [user.id],
        start_time: firebase.firestore.Timestamp.fromDate(selectedDate),
        participants: {
          [user.id]: {
            id: user.id,
            name: user.name,
            email: user.email,
            character: null,
            guess: null,
            ready_for_answer: false,
            ready_to_start: false,
            has_read_rules: false,
            seen_clues: [],
          },
        },
      })
      .then((game) => history.push(`/game/${game.id}`));
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
              onChange={handleDateChange}
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

const Options = () => {
  const classes = useStyles();

  const user = useContext(UserContext);
  let history = useHistory();

  return (
    <React.Fragment>
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
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => auth.signOut().then(() => history.push("/"))}
            >
              sign out
            </Button>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

const Join = () => {
  const classes = useStyles();

  let history = useHistory();
  let { id } = useParams();
  const [game, setGame] = useState(null);
  const user = useContext(UserContext);

  const joinGame = () => {
    console.log(user);
    db.collection("games")
      .doc(id)
      .update({
        [`participants.${user.id}`]: {
          id: user.id,
          name: user.name,
          email: user.email,
          character: null,
          guess: null,
          ready_for_answer: false,
          ready_to_start: false,
          has_read_rules: false,
          seen_clues: [],
        },
        participant_ids: firebase.firestore.FieldValue.arrayUnion(user.id),
      })
      .then(() => history.push(`/game/${id}`));
  };

  useEffect(() => {
    const unsub = db
      .collection("games")
      .doc(id)
      .onSnapshot((snapshot) => {
        const game = snapshot.data();
        setGame(game);
      });
    return () => {
      unsub();
    };
  }, []);

  if (game === null) {
    return <div>loading</div>;
  }

  if (game === undefined) {
    return <div>invalid game, check url</div>;
  }

  if (game.participants[auth.currentUser.uid] !== undefined) {
    history.push(`/game/${id}`);
  }
  return (
    <React.Fragment>
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
            <Typography>you've been invited to join</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3">{game.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => joinGame()}
            >
              alright then.
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography>current crew:</Typography>
          </Grid>
          <Grid item xs={12}>
            {Object.keys(game.participants).map((participant) => (
              <Typography align="center">
                {game.participants[participant].name}
              </Typography>
            ))}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

const Game = () => {
  let history = useHistory();
  let { id } = useParams();
  const [game, setGame] = useState(null);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const user = useContext(UserContext);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const unsub = db
      .collection("games")
      .doc(id)
      .onSnapshot((snapshot) => {
        const game = snapshot.data();
        setGame({
          id: snapshot.id,
          ...snapshot.data(),
        });
      });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const lockParticipants = () => {
    db.collection("games").doc(id).update({
      participants_locked: true,
    });
  };

  const unlockParticipants = () => {
    db.collection("games").doc(id).update({
      participants_locked: true,
    });
  };

  // on load
  if (game == null) {
    return <div>loading</div>;
  }

  if (game.name === undefined) {
    return <div>invalid game, check url or go home to start over</div>;
  }

  // if users can still join
  if (!game.participants_locked) {
    return (
      <React.Fragment>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
        >
          <Alert onClose={() => setOpen(false)} severity="success">
            Link copied to clipboard
          </Alert>
        </Snackbar>
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
              <Typography>assemble a crew for</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h3">{game.name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">
                {game.start_time.toDate().toLocaleDateString("en-AU")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <CopyToClipboard text={`${window.location.origin}/join/${id}`}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={() => setOpen(true)}
                >
                  invite
                </Button>
              </CopyToClipboard>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => lockParticipants()}
              >
                ready to go
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography>current crew:</Typography>
            </Grid>
            <Grid item xs={12}>
              {Object.keys(game.participants).map((participant) => (
                <Typography align="center">
                  {game.participants[participant].name}
                </Typography>
              ))}
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    );
  }

  // if the story needs to be picked
  if (game.story == null) {
    return <StoryPick game={game} />;
  }

  // if people still need to pick characters
  const participantsStillDeciding = [];
  Object.values(game.participants).forEach((participant) => {
    if (participant.character === null) {
      participantsStillDeciding.push(participant.name);
    }
  });

  // if the current user is waiting for other players to decide
  if (participantsStillDeciding.length > 0) {
    return <CharacterPick game={game} />;
  }

  // if we're waiting for go time
  // ready_to_start: false,
  // has_read_rules: false,
  const participantsReadyToStart = [];
  Object.values(game.participants).forEach((participant) => {
    console.log(participant);
    if (participant.ready_to_start === true) {
      participantsReadyToStart.push(participant.name);
    }
  });

  if (
    participantsReadyToStart.length < game.participant_ids.length &&
    game.start_time.toDate() > now
  ) {
    return (
      <WaitingRoom
        game={game}
        participantsReadyToStart={participantsReadyToStart}
      />
    );
  }

  // if user needs to read the rules
  if (!game.participants[user.id].has_read_rules) {
    return <GameRules game={game} />;
  }

  // if we're up to the final round and the user hasn't guessed
  if (
    game.current_round == game.story.rounds.length &&
    game.participants[user.id].guess === null
  ) {
    return <GuessKiller game={game} />;
  }

  // if on the final round and waiting on others to guess
  if (
    game.current_round == game.story.rounds.length &&
    Object.values(game.participants).filter(
      (participant) => participant.guess !== null,
    ).length !== Object.values(game.participants).length
  ) {
    return (
      <Grid
        container
        spacing={3}
        justify="center"
        alignItems="center"
        direction="column"
        className={classes.optionsButtons}
      >
        waiting for everyone to guess...
      </Grid>
    );
  }

  // if all answers have been revealed, end it
  if (game.current_answer == game.story.answers.length) {
    return <ShowCorrectGuesses game={game} />;
  }

  // once everyone has guessed and is ready for the answers
  if (
    game.current_round == game.story.rounds.length &&
    Object.values(game.participants).filter(
      (participant) => participant.ready_for_answer === true,
    ).length === Object.values(game.participants).length
  ) {
    return <ReadAnswers game={game} />;
  }

  // if everyone has guessed on final round
  if (game.current_round == game.story.rounds.length) {
    return <RevealGuesses game={game} />;
  }

  return <RoundView game={game} />;
};

const ReadAnswers = ({ game }) => {
  const classes = useStyles();
  const user = useContext(UserContext);

  const nextAnswer = () => {
    const current_answer = game.current_answer;
    db.collection("games")
      .doc(game.id)
      .update({
        current_answer: current_answer + 1,
      });
  };

  if (
    game.story.answers[game.current_answer].character ===
    game.participants[user.id].character.name
  ) {
    return (
      <Grid container justify="center" spacing={2} className={classes.clues}>
        <Grid item xs={12}>
          <Typography variant="h4">
            read to the group. they're all listening.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {game.story.answers[game.current_answer].details}
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttonFullWidth}
            onClick={() => {
              nextAnswer();
            }}
          >
            finished reading
          </Button>
        </Grid>
      </Grid>
    );
  }
  return (
    <div>
      {game.story.answers[game.current_answer].character} is reading. listen
      patiently
    </div>
  );
};

const GameRules = ({ game }) => {
  let history = useHistory();
  const classes = useStyles();
  let user = useContext(UserContext);

  const acceptRules = () => {
    db.collection("games")
      .doc(game.id)
      .update({
        [`participants.${user.id}.has_read_rules`]: true,
      });
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
          <Typography variant="h5" align="center">
            rules
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <List className={classes.root}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="talk"
                secondary={
                  <React.Fragment>
                    start conversations using your public info, but only reveal
                    your private info when asked about it by another character.
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="don't lie"
                secondary={
                  <React.Fragment>
                    it gets weird if you lie about your secrets. gotta come
                    clean when asked.
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="complete rounds"
                secondary={
                  <React.Fragment>
                    once you've revealed all your information for a round,
                    there's a button down the buttom to show you're ready for
                    the next round.{" "}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="guess the killer"
                secondary={
                  <React.Fragment>
                    once all rounds are finished, make a guess about who did it
                    and why. once everyone has guessed, the true story is
                    revealed.
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="have fun/win"
                secondary={
                  <React.Fragment>
                    the winner is whoever has the most fun (or all people who
                    guessed the killer correctly){" "}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
          </List>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttonFullWidth}
            onClick={() => acceptRules()}
          >
            <Typography align="center">let's go</Typography>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

const RoundView = ({ game }) => {
  const classes = useStyles();
  const user = useContext(UserContext);
  const [cluesModal, setCluesModal] = useState(false);
  const [timelineModal, setTimelineModal] = useState(false);
  const [notesModal, setNotesModal] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [noteSubject, setNoteSubject] = useState("misc");
  const [submittingNewNote, setSubmittingNewNote] = useState(false);
  const [previousRound, setPreviousRound] = useState(null);
  const [submittingClueDiscovery, setSubmittingClueDiscovery] = useState(false);

  let roundToView = previousRound === null ? game.current_round : previousRound;

  const nextRound = () => {
    const current_round = game.current_round;
    db.collection("games")
      .doc(game.id)
      .update({
        current_round: current_round + 1,
      });
  };

  const participant = game.participants[user.id];
  const character = participant.character;

  const updateNotes = (newNotes) => {
    console.log(newNotes);
    db.collection("games")
      .doc(game.id)
      .update({
        [`participants.${user.id}.notes`]: newNotes,
      });
  };

  const submitNewNote = () => {
    setSubmittingNewNote(true);
    db.collection("games")
      .doc(game.id)
      .update({
        [`participants.${user.id}.generic_notes`]: firebase.firestore.FieldValue.arrayUnion(
          {
            message: newNote,
            time: firebase.firestore.Timestamp.fromDate(new Date()),
            subject: noteSubject,
            round: game.current_round,
          },
        ),
      })
      .then(() => {
        setNewNote("");
        setSubmittingNewNote(false);
      });
  };

  const discoverClue = (clueNumber) => {
    setSubmittingClueDiscovery(true);
    db.collection("games")
      .doc(game.id)
      .update({
        discovered_clues: firebase.firestore.FieldValue.arrayUnion(clueNumber),
      })
      .then(() => {
        setSubmittingClueDiscovery(false);
      });
  };

  const clueSeen = (clueNumber) => {
    db.collection("games")
      .doc(game.id)
      .update({
        [`participants.${user.id}.seen_clues`]: firebase.firestore.FieldValue.arrayUnion(
          clueNumber,
        ),
      });
  };

  const cluesDiscoveredByPlayer = [];
  game.story.clues.forEach((clue, i) => {
    if (
      clue.character === character.name &&
      clue.round === game.current_round &&
      !game.discovered_clues.includes(i)
    ) {
      cluesDiscoveredByPlayer.push({
        id: i,
        ...clue,
      });
    }
  });

  const unseenCluesArray = [];
  game.discovered_clues.forEach((i) => {
    if (!participant.seen_clues.includes(i)) {
      unseenCluesArray.push(i);
    }
  });

  return (
    <React.Fragment>
      <Modal
        open={unseenCluesArray.length > 0}
        className={classes.modal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={unseenCluesArray.length > 0}>
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
                  {unseenCluesArray.map((clueNumber) => (
                    <ListItem
                      button
                      onClick={() =>
                        window.open(game.story.clues[clueNumber].url, "_blank")
                      }
                    >
                      <ListItemText
                        primary={game.story.clues[clueNumber].name}
                        secondary="tap to view"
                      />
                      <ListItemSecondaryAction
                        onClick={() => clueSeen(clueNumber)}
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
                  {game.discovered_clues.map((clueNumber) => (
                    <ListItem
                      button
                      onClick={() =>
                        window.open(game.story.clues[clueNumber].url, "_blank")
                      }
                    >
                      <ListItemText
                        primary={game.story.clues[clueNumber].name}
                      />
                    </ListItem>
                  ))}
                  {game.discovered_clues.length === 0 ? (
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
                      {Object.keys(character.timeline)
                        .sort()
                        .map((time) => (
                          <TableRow key={`timeline-${time}`}>
                            <TableCell component="th" scope="row">
                              {time}
                            </TableCell>
                            <TableCell align="right">
                              {character.timeline[time]}
                            </TableCell>
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
                    onChange={(e) => setNoteSubject(e.target.value)}
                    label="who's it about "
                  >
                    {Object.values(game.participants).map((participant) => (
                      <MenuItem value={participant.character.name}>
                        {participant.character.name} ({participant.name})
                      </MenuItem>
                    ))}
                    <MenuItem value="misc">misc</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={newNote === "" || submittingNewNote}
                  className={classes.buttonFullWidth}
                  onClick={() => submitNewNote()}
                >
                  <Typography align="center">save note</Typography>
                </Button>
              </Grid>
              <Grid item xs={12}>
                <List className={classes.root}>
                  {participant.generic_notes
                    .sort((a, b) => {
                      return b.time - a.time;
                    })
                    .map((note) => (
                      <ListItem>
                        <ListItemText
                          primary={`${note.subject}: ${note.message}`}
                          secondary={`${
                            game.story.rounds[note.round].name
                          }, ${note.time.toDate().toLocaleTimeString("en-AU")}`}
                        />
                      </ListItem>
                    ))}
                </List>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
      <Grid container className={classes.root}>
        <Grid container justify="center">
          <Grid
            container
            className={classes.cluesContainer}
            alignItems="center"
            justify="center"
            spacing={2}
          >
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
            {previousRound !== null ? (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.buttonFullWidth}
                  onClick={() => setPreviousRound(null)}
                >
                  return to current round info
                </Button>
              </Grid>
            ) : null}

            <Grid item xs={12}>
              <Typography variant="h4">
                {game.story.rounds[roundToView].name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>{game.story.rounds[roundToView].info}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper variant="outlined">
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="h6">tell people:</Typography>
                  </Grid>
                  {character.info[roundToView].public.map((info, i) => {
                    const newNotes = JSON.parse(
                      JSON.stringify(participant.notes),
                    );
                    newNotes[roundToView].public[i] = !participant.notes[
                      roundToView
                    ].public[i];
                    return (
                      <React.Fragment>
                        <Grid item xs={1} onClick={() => updateNotes(newNotes)}>
                          {participant.notes[roundToView].public[i] ? (
                            <CheckBoxIcon />
                          ) : (
                            <CheckBoxOutlineBlankIcon />
                          )}
                        </Grid>
                        <Grid
                          item
                          xs={11}
                          onClick={() => updateNotes(newNotes)}
                        >
                          <Typography align="left">{info}</Typography>
                        </Grid>
                      </React.Fragment>
                    );
                  })}
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper variant="outlined">
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="h6">keep secret:</Typography>
                  </Grid>
                  {character.info[roundToView].private.map((info, i) => {
                    const newNotes = JSON.parse(
                      JSON.stringify(participant.notes),
                    );
                    newNotes[roundToView].private[i] = !participant.notes[
                      roundToView
                    ].private[i];
                    return (
                      <React.Fragment>
                        <Grid item xs={1} onClick={() => updateNotes(newNotes)}>
                          {participant.notes[roundToView].private[i] ? (
                            <CheckBoxIcon />
                          ) : (
                            <CheckBoxOutlineBlankIcon />
                          )}{" "}
                        </Grid>
                        <Grid
                          item
                          xs={11}
                          onClick={() => updateNotes(newNotes)}
                        >
                          <Typography align="left">{info}</Typography>
                        </Grid>
                      </React.Fragment>
                    );
                  })}
                </Grid>
              </Paper>
            </Grid>
            {cluesDiscoveredByPlayer.length > 0 ? (
              <Grid item xs={12}>
                <Paper variant="outlined">
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography variant="h6">discovered a clue:</Typography>
                    </Grid>
                    {cluesDiscoveredByPlayer.map((clue, i) => (
                      <React.Fragment>
                        <Grid item xs={12}>
                          {clue.description}
                        </Grid>
                        <Grid item xs={12} className={classes.padded}>
                          <Button
                            variant="contained"
                            color="primary"
                            padding="3"
                            className={classes.buttonFullWidth}
                            onClick={() => discoverClue(clue.id)}
                          >
                            reveal {clue.name} to group
                          </Button>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            ) : null}

            <Grid item xs={12}>
              {previousRound === null ? (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.buttonFullWidth}
                  onClick={() => {
                    const newNotes = JSON.parse(
                      JSON.stringify(participant.notes),
                    );
                    newNotes[roundToView].ready = !participant.notes[
                      roundToView
                    ].ready;
                    return updateNotes(newNotes);
                  }}
                >
                  <Grid
                    container
                    justify="center"
                    alignItems="center"
                    style={{ width: "100%" }}
                  >
                    <Grid item xs={3}>
                      {participant.notes[roundToView].ready ? (
                        <CheckBoxIcon />
                      ) : (
                        <CheckBoxOutlineBlankIcon />
                      )}
                    </Grid>
                    <Grid item xs={9}>
                      <Typography align="left">done with this round</Typography>
                    </Grid>
                  </Grid>
                </Button>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              {previousRound === null ? (
                Object.values(game.participants).filter((participant) => {
                  return participant.notes[roundToView].ready;
                }).length === Object.values(game.participants).length ? (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.buttonFullWidth}
                    onClick={() => nextRound()}
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
                )
              ) : null}
            </Grid>
            {game.current_round > 0 ? (
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
                    onChange={(e) => setPreviousRound(e.target.value)}
                    label="check previous round info"
                  >
                    {game.story.rounds
                      .filter((round, i) => i < game.current_round)
                      .map((round, i) => (
                        <MenuItem value={i}>{round.name}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const WaitingRoom = ({ game, participantsReadyToStart }) => {
  const classes = useStyles();
  let user = useContext(UserContext);
  const character = game.participants[user.id].character;
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const StartNow = () => {
    db.collection("games")
      .doc(game.id)
      .update({
        [`participants.${user.id}.ready_to_start`]: true,
      });
  };

  return (
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
          {character.name}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography align="center">{character.blurb}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" align="center">
          time until the fun begins:
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" align="center">
          {formatDistance(game.start_time.toDate(), now)}
          {/* {dayjs.duration(dayjs(game.start_time.toDate()).diff(now)).humanize()} */}
          {/* {dayjs(game.start_time.toDate()).diff(now).humanize()} */}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          className={classes.buttonFullWidth}
          onClick={() => {
            StartNow();
          }}
        >
          i want to start now
        </Button>
      </Grid>
      {participantsReadyToStart.length > 0 ? (
        <Grid item xs={12}>
          <Typography align="center">
            There are some users already ready to start:{" "}
            {participantsReadyToStart.map((readyGuy) => `${readyGuy},`)}
          </Typography>
        </Grid>
      ) : null}
    </Grid>
  );
};

const RevealGuesses = ({ game }) => {
  const classes = useStyles();

  let user = useContext(UserContext);

  const SubmitReady = () => {
    db.collection("games")
      .doc(game.id)
      .update({
        [`participants.${user.id}.ready_for_answer`]: true,
      });
  };

  return (
    <Container>
      <Grid
        container
        spacing={3}
        // justify="center"
        // alignItems="center"
        // direction="column"
        className={classes.clues}
      >
        <Grid item xs={12}>
          <Typography align="center">here's what everyone guessed </Typography>
        </Grid>
        {Object.values(game.participants).map((participant) => (
          <Grid item xs={12}>
            <Paper variant="outlined">
              <Grid container className={classes.clues}>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    {participant.character.name} ({participant.name})
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h7">
                    guessed: {participant.guess.killer}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h7">
                    because: {participant.guess.why}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            disabled={game.participants[user.id].ready_for_answer}
            className={classes.buttonFullWidth}
            onClick={() => {
              SubmitReady();
            }}
          >
            {game.participants[user.id].ready_for_answer
              ? "waiting for others"
              : "enough talk. tell me who did it"}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

const ShowCorrectGuesses = ({ game }) => {
  const classes = useStyles();

  let history = useHistory();
  let user = useContext(UserContext);

  return (
    <Container>
      <Grid
        container
        spacing={3}
        // justify="center"
        // alignItems="center"
        // direction="column"
        className={classes.clues}
      >
        <Grid item xs={12}>
          <Typography align="center">{game.story.conclusion}</Typography>
        </Grid>
        {Object.values(game.participants).map((participant) => (
          <Grid item xs={12}>
            <Paper variant="outlined">
              <Grid container className={classes.clues}>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    {participant.character.name} ({participant.name}) -{" "}
                    {participant.guess.killer ===
                    game.story.answers[game.story.answers.length - 1].character
                      ? "right"
                      : "wrong"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h7">
                    guessed: {participant.guess.killer}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h7">
                    because: {participant.guess.why}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Typography align="center">thanks for choosing who-do</Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttonFullWidth}
          >
            copy link to tell the world
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttonFullWidth}
            onClick={() => history.push("/new")}
          >
            try a different story
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttonFullWidth}
            onClick={() => window.open("https://www.buymeacoffee.com/")}
          >
            buy us a coffee
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

const GuessKiller = ({ game }) => {
  const classes = useStyles();
  const [why, setWhy] = useState("");
  const [killer, setKiller] = useState(null);
  let user = useContext(UserContext);

  const SubmitGuess = () => {
    db.collection("games")
      .doc(game.id)
      .update({
        [`participants.${user.id}.guess`]: {
          killer: killer,
          why: why,
        },
      });
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
          <Typography align="center">
            ok, enough fun. time to guess who the killer was and why.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="killer-label">killer</InputLabel>
            <Select
              labelId="killer-label"
              id="killer-select"
              value={killer}
              className={classes.button}
              onChange={(e) => setKiller(e.target.value)}
              label="killer"
            >
              {Object.values(game.participants).map((participant) => (
                <MenuItem value={participant.character.name}>
                  {participant.character.name} ({participant.name})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={why}
            id="why"
            label="why"
            variant="outlined"
            className={classes.button}
            onChange={(e) => {
              setWhy(e.currentTarget.value);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              SubmitGuess();
            }}
          >
            i'm sure. submit.
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

const StoryPick = ({ game }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [stories, setStories] = useState([]);
  const [modalStory, setModalStory] = useState(null);

  useEffect(() => {
    const unsub = db.collection("stories").onSnapshot((snapshot) => {
      const allStories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStories(allStories);
    });
    return () => {
      unsub();
    };
  }, []);

  const pickStory = (story) => {
    if (Object.keys(game.participants).length === story.characters.length) {
      db.collection("games").doc(game.id).update({
        story: story,
      });
    } else {
      setSeverity("error");
      setAlert(
        `story needs ${story.characters.length} players, have ${
          Object.keys(game.participants).length
        } `,
      );
      setOpen(true);
    }
    console.log(JSON.stringify(story));
  };

  return (
    <React.Fragment>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert onClose={() => setOpen(false)} severity={severity}>
          {alert}
        </Alert>
      </Snackbar>
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
            <h2 id="transition-modal-title">
              {modalStory !== null && modalStory.name}
            </h2>
            <p id="transition-modal-description">
              {" "}
              {modalStory !== null && modalStory.blurb}
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
            <Typography align="center">
              choose a story with {Object.keys(game.participants).length}{" "}
              characters so everyone can play.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <List>
              {stories.map((story) => (
                <ListItem
                  disabled={
                    Object.keys(game.participants).length !==
                    story.characters.length
                  }
                  onClick={() => pickStory(story)}
                >
                  <ListItemText
                    primary={story.name}
                    secondary={`${story.characters.length} players`}
                    players
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => setModalStory(story)}>
                      <InfoIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12}>
            <CopyToClipboard text={`${window.location.origin}/join/${game.id}`}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => {
                  setSeverity("success");
                  setAlert("copied link to clipboard");
                  setOpen(true);
                }}
              >
                need more players still?
              </Button>
            </CopyToClipboard>
          </Grid>
          <Grid item xs={12}>
            <Typography>current crew:</Typography>
          </Grid>
          <Grid item xs={12}>
            {Object.keys(game.participants).map((participant) => (
              <Typography align="center">
                {game.participants[participant].name}
              </Typography>
            ))}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

const CharacterPick = ({ game }) => {
  const classes = useStyles();
  const user = useContext(UserContext);

  const pickCharacter = (character) => {
    console.log(character);
    // create a blank object corresponding to each round and clue
    const notes = character.info.map((round) => {
      return {
        private: round.private.map(() => false),
        public: round.public.map(() => false),
        ready: false,
      };
    });

    db.collection("games")
      .doc(game.id)
      .update({
        [`participants.${user.id}.character`]: character,
        [`participants.${user.id}.notes`]: notes,
        [`participants.${user.id}.generic_notes`]: [],
      });
  };

  const resetStory = () => {
    Object.values(game.participants).forEach((participant) => {
      participant.character = null;
      participant.notes = null;
    });

    console.log(game.participants);

    db.collection("games").doc(game.id).update({
      story: null,
      participants: game.participants,
    });
  };

  console.log(game.participants);
  console.log(user);

  let participantHasPicked = game.participants[user.id].character !== null;

  return (
    <React.Fragment>
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
              {participantHasPicked
                ? "wait for your crew to pick"
                : "pick a character"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <List className={classes.root}>
              {game.story.characters.map((character) => {
                const choosingParticipant = Object.values(
                  game.participants,
                ).find(
                  (participant) =>
                    participant.character !== null &&
                    participant.character.name === character.name,
                );
                return (
                  <ListItem
                    button
                    disabled={
                      participantHasPicked || choosingParticipant !== undefined
                    }
                    onClick={() => {
                      pickCharacter(character);
                    }}
                  >
                    <ListItemText
                      primary={character.name}
                      secondary={
                        choosingParticipant !== undefined &&
                        choosingParticipant.name
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => resetStory()}
            >
              start over
            </Button>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

// const CharacterList = ({ game }) => {
//   const classes = useStyles();

//   return (
//     <React.Fragment>
//       <Container>
//         <Grid
//           container
//           spacing={3}
//           justify="center"
//           alignItems="center"
//           direction="column"
//           className={classes.optionsButtons}
//         >
//           <Grid item xs={12}>
//             <Typography>great work. wait for your 'friends' now.</Typography>
//           </Grid>
//           <Grid item xs={12}>
//             <List className={classes.root}>
//               {game.story.characters.map((character) => {
//                 const choosingParticipant = Object.values(
//                   game.participants,
//                 ).find(
//                   (participant) =>
//                     participant.character !== null &&
//                     participant.character.name === character.name,
//                 );
//                 return (
//                   <ListItem>
//                     <ListItemText
//                       primary={character.name}
//                       secondary={
//                         choosingParticipant !== undefined &&
//                         choosingParticipant.name
//                       }
//                     />
//                   </ListItem>
//                 );
//               })}
//             </List>
//           </Grid>
//         </Grid>
//       </Container>
//     </React.Fragment>
//   );
// };

const Home = () => {
  let history = useHistory();
  const classes = useStyles();

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
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => history.push("/create")}
          >
            create game
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => history.push("/mygames")}
          >
            my games
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => history.push("/instructions")}
          >
            instructions
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            // variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => history.push("/options")}
          >
            options
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

const Instructions = () => {
  let history = useHistory();
  const classes = useStyles();

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
          <Typography variant="h5" align="center">
            what's this all about?{" "}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography align="center">
            who-do brings the power of the internet to murder mysteries so we
            can all have something to do while locked in our bedrooms.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            you'll need:{" "}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ul>
            <li>
              <Typography>4-6 friends with phones or computers</Typography>
            </li>
            <li>
              <Typography>video chat (it's lame with just voice)</Typography>
            </li>
            <li>
              <Typography>sick costumes</Typography>
            </li>
            <li>
              <Typography>1-2 hours depending on how fast you talk</Typography>
            </li>
          </ul>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            how does it work?{" "}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography align="center">
            you are given all the information you need to embody a suspicious
            character in a gruesome tale. follow the clues you have been given
            to unravel the lies and deceipt. Expect the unexpected, and the
            winner is the person who has the most fun, so don't be mad if you
            accuse the wrong person of a heinous crime.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

const SignIn = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  let history = useHistory();
  let query = useQuery();

  let target = query.get("target");

  return (
    <Grid
      container
      spacing={3}
      justify="center"
      alignItems="center"
      direction="column"
      className={classes.optionsButtons}
    >
      <Snackbar
        open={err !== null}
        autoHideDuration={6000}
        onClose={() => setErr(null)}
      >
        <Alert onClose={() => setErr(null)} severity="error">
          {err}
        </Alert>
      </Snackbar>
      <Grid item xs={12}>
        <Typography>sign in please</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={email}
          id="email"
          label="email"
          variant="outlined"
          className={classes.button}
          onChange={(e) => {
            setEmail(e.currentTarget.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={password}
          id="password"
          label="password"
          variant="outlined"
          type="password"
          className={classes.button}
          onChange={(e) => {
            setPassword(e.currentTarget.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() =>
            auth
              .signInWithEmailAndPassword(email, password)
              .then(console.log)
              .catch((err) => setErr(err.toString()))
          }
        >
          sign in
        </Button>
      </Grid>
      <Grid item xs={12}>
        <GoogleSignInButton />
      </Grid>
      <Grid item xs={12}>
        <Button
          color="primary"
          className={classes.button}
          onClick={() => history.push(`/signup?target=${target}`)}
        >
          new user?
        </Button>
      </Grid>
    </Grid>
  );
};

const SignUp = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [err, setErr] = useState(null);
  let history = useHistory();
  let query = useQuery();

  let target = query.get("target");

  const CreateUser = () => {
    if (password !== passwordConfirm) {
      setErr("passwords don't match");
      return;
    }

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(console.log)
      .catch((err) => setErr(err.toString()));
  };

  return (
    <Grid
      container
      spacing={3}
      justify="center"
      alignItems="center"
      direction="column"
      className={classes.optionsButtons}
    >
      <Snackbar
        open={err !== null}
        autoHideDuration={6000}
        onClose={() => setErr(null)}
      >
        <Alert onClose={() => setErr(null)} severity="error">
          {err}
        </Alert>
      </Snackbar>
      <Grid item xs={12}>
        <Typography>make an account then i guess</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={email}
          id="email"
          label="email"
          variant="outlined"
          className={classes.button}
          onChange={(e) => {
            setEmail(e.currentTarget.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={password}
          id="password"
          label="password"
          variant="outlined"
          type="password"
          className={classes.button}
          onChange={(e) => {
            setPassword(e.currentTarget.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={passwordConfirm}
          id="password_confirm"
          label="again"
          variant="outlined"
          type="password"
          className={classes.button}
          onChange={(e) => {
            setPasswordConfirm(e.currentTarget.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => CreateUser()}
        >
          sign up
        </Button>
      </Grid>
      <Grid item xs={12}>
        <GoogleSignInButton />
      </Grid>
      <Grid item xs={12}>
        <Button
          color="primary"
          className={classes.button}
          onClick={() => history.push(`/signin?target=${target}`)}
        >
          existing user?
        </Button>
      </Grid>
    </Grid>
  );
};

const GoogleSignInButton = () => {
  const classes = useStyles();

  const provider = new firebase.auth.GoogleAuthProvider();

  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        className={classes.button}
        onClick={() => auth.signInWithPopup(provider)}
      >
        sign in with google
      </Button>
    </div>
  );
};

const SignOutButton = () => {
  return (
    <div>
      <Button color="primary" onClick={() => auth.signOut()}>
        sign out
      </Button>
    </div>
  );
};
