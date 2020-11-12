import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import HomeIcon from "@material-ui/icons/Home";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { StateStoreContext } from "../Context";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

export default () => {
  const classes = useStyles();
  let history = useHistory();
  let { headerText } = useContext(StateStoreContext);

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <IconButton
            edge="start"
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
            whowhyhow
          </Typography>
          <Typography
            variant="subtitle1"
            className={classes.title}
            align={"right"}
            noWrap={true}
          >
            &nbsp;&nbsp;
            {headerText}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};
