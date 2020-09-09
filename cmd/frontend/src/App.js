import React, { useState, useEffect } from "react"; // update
import { firebase, db, auth } from "./firebase";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";

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
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default () => {
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
      <div>
        <SignInButton />
      </div>
    );
  }

  return (
    <div>
      <SignOutButton />
      <Router>
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

const Create = () => {
  const [name, setName] = useState("");
  let history = useHistory();

  const createGame = () => {
    db.collection("games")
      .add({
        name: name,
        participants_locked: false,
        story: null,
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
    <div>
      name your game
      <TextField
        value={name}
        id="game-name"
        label="Outlined"
        variant="outlined"
        onChange={(e) => {
          setName(e.currentTarget.value);
        }}
      />
      <Button variant="contained" color="primary" onClick={() => createGame()}>
        create game
      </Button>
    </div>
  );
};

const Join = () => {
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

  if (game == null) {
    return <div>loading</div>;
  }

  // console.log(
  //   game.participants.find(
  //     (participant) => participant.id === auth.currentUser.uid
  //   )
  // );
  if (
    game.participants.find(
      (participant) => participant.id === auth.currentUser.uid
    ) !== null
  ) {
    history.push(`/game/${id}`);
  }
  return (
    <div>
      you've been invited to join {game.name}.{" "}
      <Button variant="contained" color="primary" onClick={() => joinGame()}>
        join, yo.
      </Button>
    </div>
  );
};

const Game = () => {
  let history = useHistory();
  let { id } = useParams();
  const [game, setGame] = useState(null);

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

  // on load
  if (game == null) {
    return <div>loading</div>;
  }

  // if users can still join
  if (!game.participants_locked) {
    return (
      <div>
        <div>
          you're in game {game.name} with{" "}
          {game.participants.map((participant) => `${participant.name}, `)}
        </div>
        <div>
          give this link to others to join:{" "}
          <a
            href={`${window.location.origin}/join/${id}`}
          >{`${window.location.origin}/join/${id}`}</a>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => lockParticipants()}
        >
          ready to send
        </Button>
      </div>
    );
  }

  // if the story needs to be picked
  if (game.story == null) {
    return (
      <div>
        time to pick the story
        <StoryPick gameID={id} />
      </div>
    );
  }

  // if this participant needs to pick a character
  if (
    game.participants.find(
      (participant) => participant.id === auth.currentUser.uid
    ).character === null
  ) {
    return (
      <div>
        <div>pick a character plz</div>
        <div>
          <CharacterPick game={game} />
        </div>
      </div>
    );
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
    return <CharacterPick game={game} />;
  }

  return <div>alright time to send</div>;
};

const StoryPick = ({ gameID }) => {
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
    <div>
      {stories.map((story) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => pickStory(story)}
        >
          {story.name}
        </Button>
      ))}{" "}
    </div>
  );
};

const CharacterPick = ({ game }) => {
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
    <div>
      {game.story.characters.map((character) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => pickCharacter(character)}
        >
          {character.name}
        </Button>
      ))}{" "}
    </div>
  );
};

const Home = () => {
  let history = useHistory();

  return (
    <div>
      home
      <Button
        variant="contained"
        color="primary"
        onClick={() => history.push("/create")}
      >
        create game
      </Button>
    </div>
  );
};

const SignInButton = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => auth.signInWithPopup(provider)}
      >
        sign in
      </Button>
    </div>
  );
};

const SignOutButton = () => {
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => auth.signOut()}
      >
        sign out
      </Button>
    </div>
  );
};

// const ThingButton = () => {
//   const addBook = () => {
//     console.log("doing thing");
//     db.collection("things").add({ yo: "lo" }); // update
//   };

//   return (
//     <Button variant="contained" color="primary" onClick={() => addBook()}>
//       Hello World
//     </Button>
//   );
// };

// const ThingList = () => {
//   const [things, setThings] = useState([]);

//   useEffect(() => {
//     const unsub = db.collection("things").onSnapshot((snapshot) => {
//       const allThings = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setThings(allThings);
//     });
//     return () => {
//       unsub();
//     };
//   }, []);

//   const classes = useStyles();

//   return (
//     <div className={classes.root}>
//       <List component="nav" aria-label="secondary mailbox folders">
//         {things.map((thing) => (
//           <ListItem button>
//             <ListItemText primary={thing.yo} />
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   );
// };
