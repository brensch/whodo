import { useAuth, db, firebase } from "../Firebase";
// import { Game } from "./Game";
const USER_DETAILS_COLLECTION = "user_details";

export class UserDetails {
  constructor(
    public ID: string,
    public Email: string | null,
    public Name?: string
  ) {}

  addToFirestore(name: string) {
    this.Name = name;
    console.log(`adding ${this.ID}`);
    console.log(this);
    db.collection("user_details")
      .doc(this.ID)
      .set(JSON.parse(JSON.stringify(this)));
  }

  connect(set: React.Dispatch<React.SetStateAction<UserDetails | null>>) {
    return db
      .collection(USER_DETAILS_COLLECTION)
      .doc(this.ID)
      .onSnapshot((snapshot) => {
        const receivedUserDetails = snapshot.data() as UserDetails;
        console.log(receivedUserDetails);
        set(receivedUserDetails);
      });
  }
}
