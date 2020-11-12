import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { SubmitGuess } from "../Api";
import { StateStoreContext } from "../Context";
import { GamePageContext, ParamTypes } from "../Pages/GamePage";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  fullWidth: {
    width: "100%",
    textTransform: "none",
  },
}));

export default () => {
  const classes = useStyles();
  let { id } = useParams<ParamTypes>();
  let { gameState } = useContext(GamePageContext);
  const { userDetails } = useContext(StateStoreContext);

  const [why, setWhy] = useState<string>("");
  const [how, setHow] = useState<string>("");
  const [killer, setKiller] = useState<string>("");

  return (
    <Container>
      <div className={classes.root}>
        <Grid container spacing={3} alignItems="stretch" direction="column">
          <Grid item xs={12}>
            <Typography variant="h6" align="center">
              ok, enough fun. time to guess who, how, why.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <FormControl variant="outlined" className={classes.fullWidth}>
              <InputLabel id="killer-label">who</InputLabel>
              <Select
                labelId="killer-label"
                id="killer-select"
                value={killer}
                className={classes.fullWidth}
                onChange={(e) => setKiller(e.target.value as string)}
                label="who"
              >
                {gameState.CharacterPicks.map((pick) => {
                  const userName = gameState.Users.find(
                    (user) => user.ID === pick.UserID,
                  );
                  return (
                    <MenuItem value={pick.CharacterName}>
                      {pick.CharacterName} ({userName?.Name})
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={how}
              id="how"
              label="how"
              variant="outlined"
              className={classes.fullWidth}
              onChange={(e) => {
                setHow(e.currentTarget.value);
              }}
              multiline
              rows={5}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={why}
              id="why"
              label="why"
              variant="outlined"
              className={classes.fullWidth}
              onChange={(e) => {
                setWhy(e.currentTarget.value);
              }}
              multiline
              rows={5}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              disabled={killer === "" || why === ""}
              className={classes.fullWidth}
              onClick={() => {
                SubmitGuess(id, userDetails!.ID, killer, how, why);
              }}
            >
              J'Accuse…!
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" align="center">
              if you're not sure, just write something funny about one of the
              players.
            </Typography>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};
