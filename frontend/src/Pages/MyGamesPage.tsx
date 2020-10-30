import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ConnectGameState, GetUserGames } from "../Api";
import { StateStoreContext } from "../Context";
import { GameState } from "../Schema/Game";
import { UserGames } from "../Schema/User";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}));

const MyGamesPage = () => {
  const classes = useStyles();
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

  useEffect(() => setHeaderText("my games"), [setHeaderText]);

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
  }, [id]);

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
