import React, {
  createContext,
  FunctionComponent,
  useEffect,
  useState,
} from "react";
import { SnackState } from "../Components";
import { db, useAuth } from "../Firebase";
import { UserDetails, UserDetailsState } from "../Schema/User";
const USER_DETAILS_COLLECTION = "user_details";

export interface StateStore {
  userDetailsInitialising: boolean;
  userDetails: UserDetails | null;
  snackState: SnackState;
  setSnackState: React.Dispatch<React.SetStateAction<SnackState>>;
  headerText: string;
  setHeaderText: React.Dispatch<React.SetStateAction<string>>;
}

export const StateStoreContext = createContext<StateStore>(undefined!);

export const StateProvider: FunctionComponent<{}> = ({ children }) => {
  let authState = useAuth();

  // user details define the custom user object
  const [userDetailsState, setUserDetailsState] = useState<UserDetailsState>({
    userDetailsInitialising: true,
    userDetails: null,
  });
  // snack is the snackbar, able to be called from anywhere in the app
  const [snackState, setSnackState] = useState<SnackState>({
    severity: undefined,
    message: "",
  });

  const [headerText, setHeaderText] = useState<string>("");

  // get user details from the
  useEffect(() => {
    if (authState.user !== null) {
      // set initialising immediately since it's just finished auth
      setUserDetailsState({
        userDetailsInitialising: true,
        userDetails: null,
      });

      // get value from db
      return db
        .collection(USER_DETAILS_COLLECTION)
        .doc(authState.user.uid)
        .onSnapshot((snapshot) => {
          // dangerous cast with subsequent assign, but we only use UserDetails class to add to firestore
          const receivedUserDetails = snapshot.data() as UserDetails;
          if (receivedUserDetails === undefined) {
            setUserDetailsState({
              userDetailsInitialising: false,
              userDetails: null,
            });
            return;
          }
          setUserDetailsState({
            userDetailsInitialising: false,
            userDetails: receivedUserDetails,
          });
        });
    }

    if (authState.user === null && !authState.initialising) {
      setUserDetailsState({
        userDetailsInitialising: false,
        userDetails: null,
      });
    }
  }, [authState]);

  return (
    <StateStoreContext.Provider
      value={{
        userDetailsInitialising: userDetailsState.userDetailsInitialising,
        userDetails: userDetailsState.userDetails,
        snackState,
        setSnackState,
        headerText,
        setHeaderText,
      }}
    >
      {children}
    </StateStoreContext.Provider>
  );
};
