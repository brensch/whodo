import React, { useState, useEffect } from "react"; // update
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
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory,
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
  },
  optionsButtons: {
    minHeight: "70vh",
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

export default () => {
  const classes = useStyles();

  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const unlisten = auth.onAuthStateChanged((authUser) => {
      console.log(authUser);
      authUser ? setAuthUser(authUser) : setAuthUser(null);
    });
    return () => {
      unlisten();
    };
  });

  if (authUser == null) {
    return (
      <div className={classes.root}>
        <SignInButton />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Router>
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
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
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
          <Avatar
            alt={auth.currentUser.displayName}
            src={auth.currentUser.photoURL}
            className={classes.avatar}
          />
        </Toolbar>
      </AppBar>
    </div>
  );
};

const Create = () => {
  const classes = useStyles();

  const [name, setName] = useState("");
  let history = useHistory();

  const createGame = () => {
    db.collection("games")
      .add({
        name: name,
        participants_locked: false,
        story: null,
        current_round: 0,
        participants: [
          {
            id: auth.currentUser.uid,
            name: auth.currentUser.displayName,
            email: auth.currentUser.email,
            character: null,
          },
        ],
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
            variant="outlined"
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

  const joinGame = () => {
    const newParticipants = game.participants;
    newParticipants.push({
      id: auth.currentUser.uid,
      name: auth.currentUser.displayName,
      email: auth.currentUser.email,
      character: null,
    });
    db.collection("games")
      .doc(id)
      .update({
        participants: newParticipants,
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

  if (
    game.participants.find(
      (participant) => participant.id === auth.currentUser.uid
    ) !== undefined
  ) {
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
            <CopyToClipboard text={`${window.location.origin}/join/${id}`}>
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={() => joinGame()}
              >
                alright then.
              </Button>
            </CopyToClipboard>
          </Grid>
          <Grid item xs={12}>
            <Typography>current crew:</Typography>
          </Grid>
          <Grid item xs={12}>
            {game.participants.map((participant) => (
              <Typography align="center">{participant.name}</Typography>
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
                  variant="outlined"
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
                variant="outlined"
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
              {game.participants.map((participant) => (
                <Typography align="center">{participant.name}</Typography>
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
  if (
    game.participants.find(
      (participant) => participant.id === auth.currentUser.uid
    ).character === null
  ) {
    return <CharacterPick game={game} />;
  }

  // if people still need to pick characters
  const participantsStillDeciding = [];
  game.participants.forEach((participant) => {
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

  const nextRound = () => {
    const current_round = game.current_round;
    db.collection("games")
      .doc(game.id)
      .update({
        current_round: current_round + 1,
      });
  };

  const participant = game.participants.find(
    (participant) => participant.id === auth.currentUser.uid
  );
  const character = participant.character;
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
            <Typography variant="h4">
              {game.story.rounds[game.current_round]}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">tell people:</Typography>
          </Grid>
          <Grid item xs={12}>
            {character.info[game.current_round].public.map((info) => (
              <Typography align="center">{info}</Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">keep secret:</Typography>
          </Grid>
          <Grid item xs={12}>
            {character.info[game.current_round].private.map((info) => (
              <Typography align="center">{info}</Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            {game.current_round < game.story.rounds.length - 1 ? (
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={() => nextRound()}
              >
                done with this round
              </Button>
            ) : null}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
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
                variant="outlined"
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

  const pickCharacter = (character) => {
    console.log(character);
    const newParticipants = game.participants.map((participant) => {
      console.log(participant);
      console.log(auth.currentUser.uid);

      if (participant.id === auth.currentUser.uid) {
        return {
          ...participant,
          character: character,
        };
      }
      return participant;
    });
    console.log(newParticipants);
    db.collection("games").doc(game.id).update({
      participants: newParticipants,
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
                const choosingParticipant = game.participants.find(
                  (participant) =>
                    participant.character !== null &&
                    participant.character.name === character.name
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
                const choosingParticipant = game.participants.find(
                  (participant) =>
                    participant.character !== null &&
                    participant.character.name === character.name
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
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={() => history.push("/create")}
          >
            create game
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
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

const SignInButton = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  return (
    <div>
      <Button color="inherited" onClick={() => auth.signInWithPopup(provider)}>
        sign in
      </Button>
    </div>
  );
};

const SignOutButton = () => {
  return (
    <div>
      <Button color="inherited" onClick={() => auth.signOut()}>
        sign out
      </Button>
    </div>
  );
};
