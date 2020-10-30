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
import React, { useContext, useEffect, useState } from "react";
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
import { UserDetails } from "../Schema/User";
import { ConnectGameState, AddUserToGame } from "../Api";
import Loading from "../Components/Loading";

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
}));

interface ParamTypes {
  id: string;
}

const JoinGamePage = () => {
  const classes = useStyles();

  let history = useHistory();
  let { id } = useParams<ParamTypes>();
  const [gameState, setGameState] = useState<GameState | null>(null);
  // const authState = useAuth();
  let {
    userDetails,
    userDetailsInitialising,
    setSnackState,
    setHeaderText,
  } = useContext(StateStoreContext);

  useEffect(() => setHeaderText("join game"), []);

  useEffect(() => {
    if (userDetails !== null) {
      try {
        ConnectGameState(id, setGameState);
      } catch (err) {
        setSnackState({
          severity: "error",
          message: err.toString(),
        });
      }
    }
  }, [userDetails]);

  if (gameState === null) {
    return <Loading />;
  }

  if (gameState === undefined) {
    return <div>invalid gameState, check url</div>;
  }

  // if user has already joined redirect to actual gameState
  if (userDetails !== null && gameState.UserIDs.includes(userDetails.ID)) {
    return <Redirect to={`/game/${id}`} />;
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
            <Typography variant="h3">{gameState.Name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => {
                if (userDetails !== null) {
                  // console.log(typeOf(gameState));
                  return AddUserToGame(id, userDetails).then(() =>
                    history.push(`/game/${id}`),
                  );
                }
              }}
            >
              alright then.
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography>current crew:</Typography>
          </Grid>
          <Grid item xs={12}>
            {gameState.Users.map((userDetails) => (
              <Typography align="center">{userDetails.Name}</Typography>
            ))}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default JoinGamePage;
