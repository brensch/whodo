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
import { Game, Participant } from "../Schema/Game";
import { StateStoreContext } from "../Context";
import { UserDetails } from "../Schema/User";
import { Story } from "../Schema/Story";

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
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: "80vh",
    overflow: "scroll",
  },
}));

interface ParamTypes {
  id: string;
}

interface GameStore {
  game: Game;
}

const GamePageContext = createContext<GameStore>(undefined!);

type GameState =
  | "loading"
  | "invalid"
  | "invite"
  | "chooseStory"
  | "pickCharacter"
  | "othersPickingCharacter"
  | "waitingForGoTime"
  | "rules"
  | "viewRound"
  | "guessKiller"
  | "waitForGuesses"
  | "revealGuesses"
  | "readAnswers"
  | "correctGuesses";

const GamePage = () => {
  let { id } = useParams<ParamTypes>();
  const [game, setGame] = useState<Game | null>(null);
  const [gameState, setGameState] = useState<GameState>("loading");
  let { userDetails, userDetailsInitialising, setSnackState } = useContext(
    StateStoreContext,
  );
  const [now, setNow] = useState(new Date());

  // load the game
  useEffect(() => {
    if (userDetails !== null) {
      new Game().connect(id, setGame);
    }
  }, [userDetails]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // calculate which game state we're in
  useEffect(() => {
    if (game === null) {
      setGameState("loading");
      return;
    } else if (game.ID === "invalid") {
      setGameState("invalid");
      return;
    }

    const thisParticipant = game.Participants.find(
      (participant) => participant.User.ID === userDetails?.ID,
    );

    if (!game?.ParticipantsLocked) {
      setGameState("invite");
    } else if (game.Story === null) {
      setGameState("chooseStory");
    } else if (game.participantsStillDeciding.length > 0) {
      setGameState("pickCharacter");
    } else if (
      game.participantsReadyToStart.length < game.Participants.length &&
      !!game.StartTime &&
      now < game.StartTime.toDate()
    ) {
      setGameState("waitingForGoTime");
    } else if (!thisParticipant?.ReadRules) {
      setGameState("rules");
    } else if (game.CurrentRound < game.Story.Rounds.length) {
      setGameState("viewRound");
    } else if (thisParticipant.Guess === null) {
      setGameState("guessKiller");
    } else if (game.participantsStillGuessing.length > 0) {
      setGameState("waitForGuesses");
    } else if (
      game.participantsReadyForAnswer.length < game.Participants.length
    ) {
      setGameState("revealGuesses");
    } else if (game.CurrentAnswer < game.Story.Characters.length) {
      setGameState("readAnswers");
    } else {
      setGameState("correctGuesses");
    }
  }, [game]);
  // console.log(gameState);

  if (game === null) {
    return <div>loading</div>;
  }

  if (game === undefined) {
    return <div>invalid game, check url</div>;
  }

  if (game.ID === "invalid") {
    return <div>invalid game m8</div>;
  }

  if (userDetails !== null && !game.ParticipantIDs.includes(userDetails.ID)) {
    return <Redirect to={`/join/${id}`} />;
  }

  return (
    <GamePageContext.Provider value={{ game }}>
      <React.Fragment>
        {(() => {
          switch (gameState) {
            case "invite":
              return <InviteView />;
            case "chooseStory":
              return <ChooseStory />;
          }
        })()}
      </React.Fragment>
    </GamePageContext.Provider>
  );
};

export default GamePage;

const InviteView = () => {
  const classes = useStyles();
  let { game } = useContext(GamePageContext);
  let { setSnackState } = useContext(StateStoreContext);

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
            <Typography>assemble a crew for</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3">{game.Name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5">
              {!!game.StartTime &&
                game.StartTime.toDate().toLocaleDateString("en-AU")}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <CopyToClipboard text={`${window.location.origin}/join/${game.ID}`}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => {
                  setSnackState({
                    severity: "info",
                    message: "link copied to clipboard",
                  });
                }}
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
              onClick={() => game.lockParticipants()}
            >
              ready to go
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography>current crew:</Typography>
          </Grid>
          <Grid item xs={12}>
            {game.Participants.map((participant) => (
              <Typography align="center">{participant.User.Name}</Typography>
            ))}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

const ChooseStory = () => {
  const classes = useStyles();
  let { game } = useContext(GamePageContext);
  let { setSnackState } = useContext(StateStoreContext);
  const [stories, setStories] = useState<Array<Story>>([]);
  const [modalStory, setModalStory] = useState<Story | null>(null);

  useEffect(() => {
    const unsub = db.collection("stories2").onSnapshot((snapshot) => {
      const allStories = snapshot.docs.map((doc) => {
        const newStory = new Story();
        Object.assign(newStory, {
          id: doc.id,
          ...doc.data(),
        });
        console.log(newStory);
        return newStory;
      });
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
              {modalStory !== null && modalStory.Name}
            </h2>
            <p id="story-modal-description">
              {modalStory !== null && modalStory.Blurb}
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
              choose a story with {game.Participants.length} characters so
              everyone can play.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <List>
              {stories.map((story) => (
                <ListItem
                  disabled={
                    game.Participants.length !== story.Characters.length
                  }
                  onClick={() =>
                    game.pickStory(story).catch((err) =>
                      setSnackState({
                        severity: "error",
                        message: err.toString(),
                      }),
                    )
                  }
                >
                  <ListItemText
                    primary={story.Name}
                    secondary={`${story.Characters.length} players`}
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
            <CopyToClipboard text={`${window.location.origin}/join/${game.ID}`}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() =>
                  setSnackState({
                    severity: "info",
                    message: "link copied to clipboard",
                  })
                }
              >
                need more players still?
              </Button>
            </CopyToClipboard>
          </Grid>
          <Grid item xs={12}>
            <Typography>current crew:</Typography>
          </Grid>
          <Grid item xs={12}>
            {game.Participants.map((participant) => (
              <Typography align="center">{participant.User.Name}</Typography>
            ))}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};
