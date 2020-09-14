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
import MenuIcon from "@material-ui/icons/Menu";
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
  optionsButtons: {
    minHeight: "70vh",
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  clues: {
    padding: 10,
  },
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
  const [userDetails, setUserDetails] = useState(null);
  const [err, setErr] = useState(null);
  let target = useQuery().get("target");

  useEffect(() => {
    const unlisten = auth.onAuthStateChanged((authUser) => {
      console.log(authUser);
      authUser ? setAuthUser(authUser) : setAuthUser(null);
    });
    return () => {
      unlisten();
    };
  });

  useEffect(() => {
    console.log("authuser", authUser);
    if (authUser !== null && authUser !== "loading") {
      setLoading(true);
      console.log(authUser);
      db.collection("user_details")
        .doc(authUser.uid)
        .get()
        .then((results) => {
          console.log(results);
          if (results.exists) {
            setUserDetails(results.data());
          }
        })
        .catch((err) => setErr(err.toString()))
        .finally(() => setLoading(false));
    }
  }, [authUser]);

  if (authUser !== null && userDetails === null && !loading) {
    console.log(authUser, userDetails, loading);
    return <ChooseName setUserDetails={setUserDetails} />;
  }

  // if not authed, direct to signin
  if (
    location.pathname !== "/signin" &&
    location.pathname !== "/signup" &&
    authUser === null
  ) {
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

  if (loading) {
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
          <Typography
            onClick={() => history.push("/")}
            variant="h6"
            className={classes.title}
          >
            who-do
          </Typography>
          {auth.currentUser !== null ? (
            <IconButton onClick={() => history.push("/options")}>
              <SettingsIcon />
            </IconButton>
          ) : null}
        </Toolbar>
      </AppBar>
    </div>
  );
};

const Create = () => {
  const classes = useStyles();

  const [name, setName] = useState("");
  let history = useHistory();
  const user = useContext(UserContext);

  const createGame = () => {
    db.collection("games")
      .add({
        name: name,
        participants_locked: false,
        story: null,
        current_round: 0,
        current_answer: 0,
        participants: {
          [auth.currentUser.uid]: {
            id: user.id,
            name: user.name,
            email: user.email,
            character: null,
            guess: null,
            ready_for_answer: false,
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
          <Button
            variant="contained"
            color="primary"
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
        },
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

  // if this participant needs to pick a character
  if (game.participants[user.id].character === null) {
    return <CharacterPick game={game} />;
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
    return <CharacterList game={game} />;
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
      <Grid container spacing={2} className={classes.clues}>
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

const RoundView = ({ game }) => {
  const classes = useStyles();
  const user = useContext(UserContext);

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

  return (
    <Grid container spacing={2} className={classes.clues}>
      <Grid item xs={12}>
        <Typography variant="h4">
          {game.story.rounds[game.current_round].name}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>{game.story.rounds[game.current_round].info}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper variant="outlined">
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h6">tell people:</Typography>
            </Grid>
            {character.info[game.current_round].public.map((info, i) => {
              const newNotes = JSON.parse(JSON.stringify(participant.notes));
              newNotes[game.current_round].public[i] = !participant.notes[
                game.current_round
              ].public[i];
              return (
                <React.Fragment>
                  <Grid item xs={1} onClick={() => updateNotes(newNotes)}>
                    {participant.notes[game.current_round].public[i] ? (
                      <CheckBoxIcon />
                    ) : (
                      <CheckBoxOutlineBlankIcon />
                    )}
                  </Grid>
                  <Grid item xs={11} onClick={() => updateNotes(newNotes)}>
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
            {character.info[game.current_round].private.map((info, i) => {
              const newNotes = JSON.parse(JSON.stringify(participant.notes));
              newNotes[game.current_round].private[i] = !participant.notes[
                game.current_round
              ].private[i];
              return (
                <React.Fragment>
                  <Grid item xs={1} onClick={() => updateNotes(newNotes)}>
                    {participant.notes[game.current_round].private[i] ? (
                      <CheckBoxIcon />
                    ) : (
                      <CheckBoxOutlineBlankIcon />
                    )}{" "}
                  </Grid>
                  <Grid item xs={11} onClick={() => updateNotes(newNotes)}>
                    <Typography align="left">{info}</Typography>
                  </Grid>
                </React.Fragment>
              );
            })}
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          className={classes.buttonFullWidth}
          onClick={() => {
            const newNotes = JSON.parse(JSON.stringify(participant.notes));
            newNotes[game.current_round].ready = !participant.notes[
              game.current_round
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
              {participant.notes[game.current_round].ready ? (
                <CheckBoxIcon />
              ) : (
                <CheckBoxOutlineBlankIcon />
              )}{" "}
            </Grid>
            <Grid item xs={9}>
              <Typography align="left"> done with this round</Typography>
            </Grid>
          </Grid>
        </Button>
      </Grid>
      <Grid item xs={12}>
        {Object.values(game.participants).filter((participant) => {
          console.log(participant.notes[game.current_round].ready);
          return participant.notes[game.current_round].ready;
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
            <Typography align="left"> not everyone ready yet</Typography>
          </Button>
        )}
      </Grid>
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
      });
  };

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
            <Typography>pick a character </Typography>
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
                    disabled={choosingParticipant !== undefined}
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
        </Grid>
      </Container>
    </React.Fragment>
  );
};

const CharacterList = ({ game }) => {
  const classes = useStyles();

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
            <Typography>great work. wait for your 'friends' now.</Typography>
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
                  <ListItem>
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
        </Grid>
      </Container>
    </React.Fragment>
  );
};

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
            onClick={() => history.push("/create")}
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
