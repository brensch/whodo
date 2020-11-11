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
import React, { useContext, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useParams } from "react-router-dom";
import { SetGameStory } from "../Api";
import { StateStoreContext } from "../Context";
import { db } from "../Firebase";
import { GamePageContext, ParamTypes } from "../Pages/GamePage";
import { StorySummary, STORY_SUMMARY_COLLECTION } from "../Schema/Story";

const useStyles = makeStyles((theme) => ({
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
  let { setSnackState } = useContext(StateStoreContext);
  const [stories, setStories] = useState<Array<StorySummary>>([]);
  const [modalStory, setModalStory] = useState<StorySummary | null>(null);

  useEffect(() => {
    const unsub = db
      .collection(STORY_SUMMARY_COLLECTION)
      .onSnapshot((snapshot) => {
        const allStories = snapshot.docs.map((doc) => {
          return (doc.data() as unknown) as StorySummary;
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
              {modalStory !== null && modalStory.Metadata.Name}
            </h2>
            <p id="story-modal-description">
              {modalStory !== null && modalStory.Metadata.Blurb}
            </p>
            <Button
              variant="contained"
              color="primary"
              className={classes.buttonFullWidth}
              onClick={() => {
                if (modalStory === null) {
                  return;
                }

                if (gameState.UserIDs.length !== modalStory.Characters.length) {
                  setSnackState({
                    severity: "info",
                    message: "haven't invited enough people to play this game",
                  });
                  return;
                }
                SetGameStory(id, modalStory).catch((err) =>
                  setSnackState({
                    severity: "error",
                    message: err.toString(),
                  }),
                );
              }}
            >
              <Typography align="center">choose this story</Typography>
            </Button>
          </div>
        </Fade>
      </Modal>
      <Container>
        <Grid container spacing={3} alignItems="stretch" direction="column">
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom align={"center"}>
              pick a story
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom align={"center"}>
              with {gameState.UserIDs.length} player
              {gameState.UserIDs.length > 1 && "s"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {gameState.Users.map((user) => (
              <Typography align="center">{user.Name}</Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            <CopyToClipboard text={`${window.location.origin}/join/${id}`}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() =>
                  setSnackState({
                    severity: "info",
                    message: "invite link copied to clipboard",
                  })
                }
              >
                or invite more players
              </Button>
            </CopyToClipboard>
          </Grid>
          <Grid item xs={12}>
            <List component="nav">
              {stories.map((story) => (
                <React.Fragment>
                  <Divider />
                  <ListItem
                    button
                    className={classes.listItem}
                    disabled={
                      gameState.UserIDs.length !== story.Characters.length
                    }
                    onClick={() => setModalStory(story)}
                  >
                    <ListItemText
                      primary={story.Metadata.Name}
                      secondary={`${
                        story.Characters.length !== gameState.UserIDs.length
                          ? "need"
                          : ""
                      } ${story.Characters.length} players`}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
              <Divider />
            </List>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};
