import Button from "@material-ui/core/Button";
import React, { useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Loading from "../Components/Loading";
import { StateStoreContext } from "../Context";

const SplashPage = () => {
  let history = useHistory();
  let { userDetails, userDetailsInitialising } = useContext(StateStoreContext);
  // if user has already joined redirect to actual game
  if (userDetails !== null) {
    return <Redirect to={`/start`} />;
  }

  if (userDetailsInitialising) {
    return <Loading />;
  }

  return (
    <div>
      splash yo<Button onClick={() => history.push("/start")}>start</Button>
    </div>
  );
};

export default SplashPage;
