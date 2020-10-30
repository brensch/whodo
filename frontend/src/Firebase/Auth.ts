import { useEffect, useState } from "react";
import { auth } from ".";

export const useAuth = () => {
  const [state, setState] = useState(() => {
    const user = auth.currentUser;
    return { initialising: !user, user };
  });

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setState({ initialising: false, user });
    });
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, []);

  return state;
};
