import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
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
  buttonFullWidth: {
    width: "100%",
    textTransform: "none",
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
            <Typography variant="h4" gutterBottom align={"center"}>
              {modalCharacter?.Name}
            </Typography>
            <Typography variant="body1" gutterBottom align={"center"}>
              {modalCharacter?.Description}
            </Typography>
            <Typography variant="body2" gutterBottom align={"center"}>
              age: {modalCharacter?.Age}
            </Typography>
            <Typography variant="body2" gutterBottom align={"center"}>
              {modalCharacter?.Blurb}
            </Typography>
            <Typography variant="body2" gutterBottom align={"center"}>
              costume: {modalCharacter?.Costume}
            </Typography>
            <Typography variant="body2" gutterBottom align={"center"}>
              accessories: {modalCharacter?.Accessories}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              className={classes.buttonFullWidth}
              onClick={() => {
                if (modalCharacter === null || modalCharacter.Name === null) {
                  return;
                }
                PickCharacter(id, userDetails.ID, modalCharacter.Name)
                  .then(() => setModalCharacter(null))
                  .catch((err) =>
                    setSnackState({
                      severity: "error",
                      message: err.toString(),
                    }),
                  );
              }}
            >
              <Typography align="center">sounds like me</Typography>
            </Button>
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
                      onClick={() => setModalCharacter(character)}
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
