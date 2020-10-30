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
import { GameState } from "../Schema/Game";
import { StateStoreContext } from "../Context";
import { UserDetails, UserGames } from "../Schema/User";
import { Story } from "../Schema/Story";
import { ConnectGameState, GetUserGames } from "../Api";

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

const MyGamesPage = () => {
  const classes = useStyles();
  let history = useHistory();
  const [userGames, setUserGames] = useState<UserGames>({
    Games: [],
  });
  const { userDetails, userDetailsInitialising, setHeaderText } = useContext(
    StateStoreContext,
  );

  useEffect(() => {
    if (!userDetailsInitialising && !!userDetails) {
      GetUserGames(userDetails.ID).then(setUserGames);
    }
  }, [userDetails, userDetailsInitialising]);

  useEffect(() => setHeaderText("my games"), []);

  return (
    <React.Fragment>
      <List
        component="nav"
        aria-labelledby="games-list"
        className={classes.root}
      >
        {userGames.Games.map((gameID) => (
          <GameItem id={gameID} />
        ))}
      </List>
    </React.Fragment>
  );
};

export default MyGamesPage;

interface GameItemProps {
  id: string;
}

const GameItem = ({ id }: GameItemProps) => {
  let history = useHistory();

  const [game, setGame] = useState<GameState | null>(null);

  useEffect(() => {
    ConnectGameState(id, setGame);
  }, []);

  if (game === null) {
    return null;
  }

  return (
    <ListItem button onClick={() => history.push("/game/" + id)}>
      <ListItemText
        primary={`${game.Name}`}
        secondary={`${
          game.SelectedStory !== null && game.SelectedStory.Metadata.Name
        }: ${game.Users.map((user) => ` ${user.Name}`)}`}
      />
    </ListItem>
  );
};
