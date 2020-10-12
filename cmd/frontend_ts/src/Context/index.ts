import React, { createContext } from "react";
import { UserDetails, UserDetailsState } from "../Schema/User";

export const UserContext = createContext<UserDetailsState>({
  initialising: true,
  userDetails: null,
});
