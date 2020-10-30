import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import React, { useContext, useEffect, useState } from "react";
import { StateStoreContext } from "../Context";

export interface SnackState {
  severity: "info" | "success" | "warning" | "error" | undefined;
  message: string;
}

export const Snack = () => {
  const [open, setOpen] = useState(false);
  const { snackState, setSnackState } = useContext(StateStoreContext);
  const { message, severity } = snackState;

  useEffect(() => {
    if (message !== "" && severity !== undefined) {
      setOpen(true);
    }
  }, [message, severity]);

  // only remove text once snack is closed to avoid flickering out
  useEffect(() => {
    if (!open) {
      setTimeout(
        () =>
          setSnackState({
            message: "",
            severity: undefined,
          }),
        500,
      );
    }
  }, [open, setSnackState]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => setOpen(false)}
    >
      <Alert onClose={() => setOpen(false)} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};
