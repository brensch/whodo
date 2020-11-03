import React, { createContext, useContext, useEffect, useState } from "react";
import { Redirect, useParams, Prompt } from "react-router-dom";
import {
  ConnectGameState,
  ConnectPlayerView,
  ConnectPopulateInfoRequest,
  RequestInfoPopulation,
  RequestNextAnswer,
} from "../Api";
import { Loading } from "../Components";
import { StateStoreContext } from "../Context";
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
import { GameState, PlayerView, PopulateInfoRequest } from "../Schema/Game";

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

  let { userDetails, setSnackState, setHeaderText } = useContext(
    StateStoreContext,
  );
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    setHeaderText("");
  }, [setHeaderText]);

  // load the gameState
  useEffect(() => {
    if (userDetails !== null) {
      ConnectGameState(id, setGameState);
      ConnectPopulateInfoRequest(id, setPopulateInfoRequest);
      ConnectPlayerView(userDetails, id, setPlayerView);
    }
  }, [userDetails, id]);

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
      populateInfoRequest === null ||
      gameState === undefined
    ) {
      return;
    }

    setHeaderText(gameState.Name);

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
      now < gameState.StartTime.toDate()
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
      if (gameState.Answers.length === 0) {
        RequestNextAnswer(id, playerView.ID, 0);
      }
      setGameStage("ReadAnswers");
    } else {
      setGameStage("CorrectGuesses");
    }
  }, [
    gameState,
    playerView,
    populateInfoRequest,
    id,
    now,
    setHeaderText,
    setSnackState,
    userDetails,
  ]);

  if (gameState === undefined) {
    return <div>invalid game id, check url or go home and start again.</div>;
  }

  if (gameState === null || playerView === null) {
    return <Loading />;
  }

  if (userDetails !== null && !gameState.UserIDs.includes(userDetails.ID)) {
    return <Redirect to={`/join/${id}`} />;
  }

  return (
    <GamePageContext.Provider value={{ gameState, playerView }}>
      <React.Fragment>
        <Prompt
          when={gameStage !== "CorrectGuesses"}
          message="you're about to leave this excellent game right when things are getting exciting. you can find it again under 'my games'"
        />
        {(() => {
          switch (gameStage) {
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
