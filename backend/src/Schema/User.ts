export const USER_DETAILS_COLLECTION = "user_details";
export const USER_GAMES_COLLECTION = "user_games";

export interface UserDetailsState {
  userDetailsInitialising: boolean;
  userDetails: UserDetails | null;
}

export interface UserDetails {
  ID: string;
  Email: string;
  Name: string;
}

export interface UserGames {
  Games: string[];
}
