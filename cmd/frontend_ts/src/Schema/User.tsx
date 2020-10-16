import { useAuth, db, firebase } from "../Firebase";
// import { Game } from "./Game";

export const USER_COLLECTION = "user_details";

export interface UserDetailsState {
  userDetailsInitialising: boolean;
  userDetails: UserDetails | null;
}

export class UserDetails {
  constructor(
    public ID: string,
    public Email: string | null,
    public Name?: string,
    public Games: Array<string> = [],
  ) {}

  addToFirestore(name: string) {
    this.Name = name;
    console.log(`adding ${this.ID}`);
    console.log(this);
    db.collection("user_details")
      .doc(this.ID)
      .set(JSON.parse(JSON.stringify(this)));
  }

  // connect(set: React.Dispatch<React.SetStateAction<UserDetailsState>>) {
  //   return db
  //     .collection(USER_DETAILS_COLLECTION)
  //     .doc(this.ID)
  //     .onSnapshot((snapshot) => {
  //       const receivedUserDetails = snapshot.data() as UserDetails;
  //       console.log(receivedUserDetails);
  //       if (receivedUserDetails === undefined) {
  //         set({ userDetailsInitialising: false, userDetails: null });
  //         return;
  //       }
  //       set({
  //         userDetailsInitialising: false,
  //         userDetails: receivedUserDetails,
  //       });
  //     });
  // }
}
