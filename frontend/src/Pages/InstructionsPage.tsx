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
              <Typography>friends. 4-6 of them.</Typography>
            </li>
            <li>
              <Typography>video chat.</Typography>
            </li>
            <li>
              <Typography>sick costumes.</Typography>
            </li>
            <li>
              <Typography>1-2 hours depending on how fast you talk.</Typography>
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

export default Instructions;
