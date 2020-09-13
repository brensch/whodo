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
import WorkIcon from "@material-ui/icons/Work";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
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
    width: "100%",
    textTransform: "none",
  },
  optionsButtons: {
    minHeight: "70vh",
    width: "100%",
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
    if (authUser !== null && authUser !== "loading") {
      setLoading(true);
      console.log(authUser);
      db.collection("user_details")
        .doc(authUser.uid)
        .get()
        .then((results) => {
          if (results.exists) {
            setUserDetails(results.data());
          }
        })
        .then(() => setLoading(false))
        .catch(console.log);
    }
  }, [authUser]);

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

  if (loading) {
    return <div>loading user</div>;
  }
  // if authed but no userDetails, show name select page
  if (authUser !== null && userDetails === null && !loading) {
    console.log(authUser, userDetails, loading);
    return <ChooseName setUserDetails={setUserDetails} />;
  }

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
      <AppBar
        position="static"
        color="transparent"
        onClick={() => history.push("/")}
      >
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            who-do
          </Typography>
          {auth.currentUser !== null ? (
            <Avatar
              alt={auth.currentUser.displayName}
              src={auth.currentUser.photoURL}
              className={classes.avatar}
              onClick={() => auth.signOut()}
            />
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
        participants: {
          [auth.currentUser.uid]: {
            id: user.id,
            name: user.name,
            email: user.email,
            character: null,
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
    return <StoryPick gameID={id} />;
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

  console.log([participantsStillDeciding]);
  if (participantsStillDeciding.length > 0) {
    return <CharacterList game={game} />;
  }

  return (
    <div>
      <RoundView game={game} />
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
  return (
    <Grid
      container
      spacing={2}
      // padding={3}
      // justify="center"
      // alignItems="center"
      // direction="column"
      className={classes.clues}
    >
      <Grid item xs={12}>
        <Typography variant="h4">
          {game.story.rounds[game.current_round]}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper variant="outlined">
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h6">tell people:</Typography>
            </Grid>
            {character.info[game.current_round].public.map((info) => (
              <React.Fragment>
                <Grid item xs={1}>
                  <CheckBoxOutlineBlankIcon />
                </Grid>
                <Grid item xs={11}>
                  <Typography align="left">{info}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper variant="outlined">
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h6">keep secret:</Typography>
            </Grid>
            {character.info[game.current_round].private.map((info) => (
              <React.Fragment>
                <Grid item xs={1}>
                  <CheckBoxOutlineBlankIcon />
                </Grid>
                <Grid item xs={11}>
                  <Typography align="left">{info}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        {game.current_round < game.story.rounds.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => nextRound()}
          >
            done with this round
          </Button>
        ) : null}
      </Grid>
    </Grid>
  );
};

const StoryPick = ({ gameID }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [stories, setStories] = useState([]);

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
    db.collection("games").doc(gameID).update({
      story: story,
    });
    console.log(JSON.stringify(story));
  };

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
            <Typography>choose your story</Typography>
          </Grid>
          <Grid item xs={12}>
            <List className={classes.root}>
              {stories.map((story) => (
                <ListItem onClick={() => pickStory(story)}>
                  <ListItemAvatar>
                    <Avatar>
                      <ImageIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={story.name}
                    secondary={`${story.characters.length} players`}
                    players
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12}>
            <CopyToClipboard text={`${window.location.origin}/join/${gameID}`}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => setOpen(true)}
              >
                need more players still?
              </Button>
            </CopyToClipboard>
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
    // const newParticipants = game.participants.map((participant) => {
    //   console.log(participant);
    //   console.log(auth.currentUser.uid);

    //   if (participant.id === auth.currentUser.uid) {
    //     return {
    //       ...participant,
    //       character: character,
    //     };
    //   }
    //   return participant;
    // });
    // console.log(newParticipants);
    db.collection("games")
      .doc(game.id)
      .update({
        [`participants.${user.id}.character`]: character,
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
            <Typography>pick a character plz</Typography>
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
