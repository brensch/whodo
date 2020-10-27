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
import { GameState, PlayerView, PopulateInfoRequest } from "../Schema/Game";
import { StateStoreContext } from "../Context";
import { UserDetails } from "../Schema/User";
import {
  StoryMetadata,
  StorySummary,
  STORY_SUMMARY_COLLECTION,
} from "../Schema/Story";
import {
  ConnectGameState,
  ConnectPlayerView,
  ConnectPopulateInfoRequest,
  RequestInfoPopulation,
  SetGameStory,
} from "../Api";
import { useRadioGroup } from "@material-ui/core";
import {
  CorrectGuesses,
  GuessKiller,
  PickCharacter,
  PickStory,
  ReadAnswers,
  RevealGuesses,
  Rules,
  ViewRound,
  WaitForGuesses,
  WaitingForGoTime,
} from "../GameStages";

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

export interface ParamTypes {
  id: string;
}

interface GameStore {
  gameState: GameState;
  playerView: PlayerView;
}

export const GamePageContext = createContext<GameStore>(undefined!);

type GameStage =
  | "loading"
  | "invalid"
  | "requestingInfoPopulation"

  // states with pages
  | "PickStory"
  | "PickCharacter"
  | "WaitingForGoTime"
  | "Rules"
  | "ViewRound"
  | "GuessKiller"
  | "WaitForGuesses"
  | "RevealGuesses"
  | "ReadAnswers"
  | "CorrectGuesses";

const GamePage = () => {
  let { id } = useParams<ParamTypes>();
  const [gameStage, setGameStage] = useState<GameStage>("loading");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [
    populateInfoRequest,
    setPopulateInfoRequest,
  ] = useState<PopulateInfoRequest | null>(null);
  const [playerView, setPlayerView] = useState<PlayerView | null>(null);

  let { userDetails, userDetailsInitialising, setSnackState } = useContext(
    StateStoreContext,
  );
  const [now, setNow] = useState(new Date());

  // load the gameState
  useEffect(() => {
    if (userDetails !== null) {
      ConnectGameState(id, setGameState);
      ConnectPopulateInfoRequest(id, setPopulateInfoRequest);
      ConnectPlayerView(userDetails, id, setPlayerView);
    }
  }, [userDetails]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // calculate which gameState state we're in
  useEffect(() => {
    if (
      gameState === null ||
      playerView === null ||
      populateInfoRequest === null
    ) {
      setGameStage("loading");
      return;
    }

    // const thisParticipant = gameState.User.find(
    //   (participant) => participant.User.ID === userDetails?.ID,
    // );

    if (gameState.SelectedStory === null) {
      setGameStage("PickStory");
    } else if (gameState.CharacterPicks.length < gameState.Users.length) {
      setGameStage("PickCharacter");
    } else if (populateInfoRequest.State === "picking") {
      setGameStage("requestingInfoPopulation");
      // get every client to watch the state of the game and ask for the server to populate info
      RequestInfoPopulation(id).catch((err) =>
        setSnackState({
          severity: "error",
          message: err.toString(),
        }),
      );
    } else if (
      gameState.ReadyToStart.length < gameState.Users.length &&
      now < gameState.StartTime
    ) {
      setGameStage("WaitingForGoTime");
    } else if (!playerView.ReadRules) {
      setGameStage("Rules");
    } else if (gameState.CurrentRound < gameState.SelectedStory.Rounds.length) {
      setGameStage("ViewRound");
    } else if (
      gameState.Guesses.filter((guess) => guess.UserID === userDetails?.ID)
        .length === 0
    ) {
      setGameStage("GuessKiller");
    } else if (gameState.Guesses.length < gameState.Users.length) {
      setGameStage("WaitForGuesses");
    } else if (gameState.ReadyForAnswer.length < gameState.Users.length) {
      setGameStage("RevealGuesses");
    } else if (!gameState.FinishedAnswers) {
      setGameStage("ReadAnswers");
    } else {
      setGameStage("CorrectGuesses");
    }
  }, [gameState, playerView, populateInfoRequest]);

  if (gameState === null || playerView === null) {
    return <div>loading</div>;
  }

  if (gameState === undefined) {
    return <div>invalid gameState, check url</div>;
  }

  if (userDetails !== null && !gameState.UserIDs.includes(userDetails.ID)) {
    return <Redirect to={`/join/${id}`} />;
  }

  return (
    <GamePageContext.Provider value={{ gameState, playerView }}>
      <React.Fragment>
        {(() => {
          switch (gameStage) {
            // case "invite":
            //   return <InviteView />;
            case "PickStory":
              return <PickStory />;
            case "PickCharacter":
              return <PickCharacter />;
            case "WaitingForGoTime":
              return <WaitingForGoTime />;
            case "PickStory":
              return <PickStory />;
            case "PickCharacter":
              return <PickCharacter />;
            case "WaitingForGoTime":
              return <WaitingForGoTime />;
            case "Rules":
              return <Rules />;
            case "ViewRound":
              return <ViewRound />;
            case "GuessKiller":
              return <GuessKiller />;
            case "WaitForGuesses":
              return <WaitForGuesses />;
            case "RevealGuesses":
              return <RevealGuesses />;
            case "ReadAnswers":
              return <ReadAnswers />;
            case "CorrectGuesses":
              return <CorrectGuesses />;
          }
        })()}
      </React.Fragment>
    </GamePageContext.Provider>
  );
};

export default GamePage;

// const InviteView = () => {
//   const classes = useStyles();
//   let { id } = useParams<ParamTypes>();
//   let { gameState } = useContext(GamePageContext);
//   let { setSnackState } = useContext(StateStoreContext);

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
//             <Typography>assemble a crew for</Typography>
//           </Grid>
//           <Grid item xs={12}>
//             <Typography variant="h3">{gameState.Name}</Typography>
//           </Grid>
//           <Grid item xs={12}>
//             <Typography variant="h5">
//               {!!gameState.StartTime &&
//                 gameState.StartTime.toLocaleDateString("en-AU")}
//             </Typography>
//           </Grid>
//           <Grid item xs={12}>
//             <CopyToClipboard text={`${window.location.origin}/join/${id}`}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 className={classes.button}
//                 onClick={() => {
//                   setSnackState({
//                     severity: "info",
//                     message: "link copied to clipboard",
//                   });
//                 }}
//               >
//                 invite
//               </Button>
//             </CopyToClipboard>
//           </Grid>
//           <Grid item xs={12}>
//             <Button
//               variant="contained"
//               color="primary"
//               className={classes.button}
//               // onClick={() => gameState.lockParticipants()}
//             >
//               ready to go
//             </Button>
//           </Grid>
//           <Grid item xs={12}>
//             <Typography>current crew:</Typography>
//           </Grid>
//           <Grid item xs={12}>
//             {gameState.Users.map((user) => (
//               <Typography align="center">{user.Name}</Typography>
//             ))}
//           </Grid>
//         </Grid>
//       </Container>
//     </React.Fragment>
//   );
// };
