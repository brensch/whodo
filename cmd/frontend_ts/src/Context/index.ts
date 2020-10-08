import React, { createContext } from "react";
import { UserDetails } from "../Schema/User";

export const UserContext = createContext<UserDetails | null>(null);
