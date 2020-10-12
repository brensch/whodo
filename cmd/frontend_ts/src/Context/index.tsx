import React, {
  createContext,
  FunctionComponent,
  useState,
  useEffect,
} from "react";
import { UserDetails, UserDetailsState } from "../Schema/User";
import { SnackState } from "../Components/Snack";
import { useAuth, db, firebase } from "../Firebase";

export interface StateStore {
  initialising: boolean;
  userDetails: UserDetails | null;
  snackState: SnackState;
  setSnackState: React.Dispatch<React.SetStateAction<SnackState>>;
}

export const StateStoreContext = createContext<StateStore>(undefined!);

export const StateProvider: FunctionComponent<{}> = ({ children }) => {
  let authState = useAuth();

  // user details define the custom user object
  const [userDetailsState, setUserDetailsState] = useState<UserDetailsState>({
    initialising: true,
    userDetails: null,
  });
  // snack is the snackbar, able to be called from anywhere in the app
  const [snackState, setSnackState] = useState<SnackState>({
    severity: undefined,
    message: "",
  });

  useEffect(() => {
    if (authState.user !== null) {
      const userDetailConnector = new UserDetails(
        authState.user.uid,
        authState.user.email
      );
      userDetailConnector.connect(setUserDetailsState);
    }
  }, [authState]);

  return (
    <StateStoreContext.Provider
      value={{
        initialising: userDetailsState.initialising,
        userDetails: userDetailsState.userDetails,
        snackState,
        setSnackState,
      }}
    >
      {children}
    </StateStoreContext.Provider>
  );
};
