import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { PickCharacter, SetGameStory } from "../Api";
import { StateStoreContext } from "../Context";
import { GamePageContext, ParamTypes } from "../Pages/GamePage";
import { Character } from "../Schema/Story";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  optionsButtons: {
    minHeight: "70vh",
  },
  button: {
    width: "100%",
    textTransform: "none",
  },
  listItem: {
    width: "100%",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 1, 3),
    maxHeight: "80vh",
    overflow: "auto",
  },
}));

export default () => {
  const classes = useStyles();
  let { id } = useParams<ParamTypes>();
  let { gameState } = useContext(GamePageContext);
  const { userDetails, userDetailsInitialising, setSnackState } = useContext(
    StateStoreContext,
  );
  const [modalCharacter, setModalCharacter] = useState<Character | null>(null);

  if (
    userDetails === null ||
    userDetailsInitialising ||
    gameState.SelectedStory === null
  ) {
    return null;
  }

  let participantHasPicked =
    gameState.CharacterPicks.filter((pick) => pick.UserID === userDetails.ID)
      .length !== 0;

  return (
    <React.Fragment>
      <Modal
        open={modalCharacter !== null}
        onClose={() => setModalCharacter(null)}
        className={classes.modal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalCharacter !== null}>
          <div className={classes.modalPaper}>
            <h2 id="story-modal-title">
              {modalCharacter !== null && modalCharacter.Name}
            </h2>
            <p id="story-modal-description">
              {modalCharacter !== null && modalCharacter.Blurb}
            </p>
          </div>
        </Fade>
      </Modal>
      <Container>
        <Grid
          container
          spacing={3}
          // justify="center"
          alignItems="stretch"
          direction="column"
          className={classes.optionsButtons}
        >
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom align={"center"}>
              pick a character
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <List className={classes.root}>
              {gameState.SelectedStory.Characters.map((character) => {
                const pickMatchingThisCharacter = gameState.CharacterPicks.find(
                  (pick) => pick.CharacterName === character.Name,
                );
                return (
                  <React.Fragment>
                    <Divider />
                    <ListItem
                      className={classes.listItem}
                      button
                      disabled={
                        participantHasPicked ||
                        pickMatchingThisCharacter !== undefined
                      }
                      onClick={() =>
                        PickCharacter(id, userDetails.ID, character.Name).catch(
                          (err) =>
                            setSnackState({
                              severity: "error",
                              message: err.toString(),
                            }),
                        )
                      }
                    >
                      <ListItemText
                        primary={`${character.Name} ${
                          pickMatchingThisCharacter !== undefined
                            ? ` - 
                          ${
                            gameState.Users.find(
                              (user) =>
                                user.ID === pickMatchingThisCharacter.UserID,
                            )?.Name
                          }`
                            : ""
                        }`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => setModalCharacter(character)}
                        >
                          <InfoIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </React.Fragment>
                );
              })}
              <Divider />
            </List>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() =>
                SetGameStory(id, null).catch((err) =>
                  setSnackState({
                    severity: "error",
                    message: err.toString(),
                  }),
                )
              }
            >
              choose a different story
            </Button>
          </Grid>
          {participantHasPicked && (
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom align={"center"}>
                wait for everyone to pick
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </React.Fragment>
  );
};
