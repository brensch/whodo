import * as React from "react";
import { render } from "react-dom";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  RouteComponentProps,
  withRouter,
  useLocation,
  useHistory,
  Switch,
} from "react-router-dom";
import { useAuth, db, firebase } from "./Firebase";

import Auth, { SignOut } from "./Pages/Auth";
// import SignOut from "./Pages/SignOut";

const App = () => {
  return (
    <React.Fragment>
      <Link to={"/protected"}>protec</Link>
      <Switch>
        <Route exact path="/" component={Public} />
        <Route path="/auth" component={Auth} />
        <PrivateRoute path="/protected" component={Protected} />
        <PrivateRoute path="/protected_class" component={ProtectedClass} />
      </Switch>
      <SignOut />
    </React.Fragment>
  );
};

export default App;

const Public = () => <p>Public page</p>;

const Protected = () => <p>Protected page</p>;

class ProtectedClass extends React.Component<{}, {}> {
  render() {
    return <p>Protected class</p>;
  }
}

const PrivateRoute: React.ComponentType<any> = ({
  component: Component,
  ...rest
}) => {
  let authState = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        authState.user !== null ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/auth",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

// interface Props extends RouteComponentProps {}
// interface State {
//   redirectToReferrer: boolean;
// }

// class Login extends React.Component<Props, State> {
//   constructor(props: Props) {
//     super(props);
//     this.state = {
//       redirectToReferrer: false,
//     };
//   }

//   login = () => {
//     fakeAuth.authenticate(() => {
//       this.setState({ redirectToReferrer: true });
//     });
//   };

//   render() {
//     // let { from } = this.props.location.state || { from: { pathname: "/" } };
//     console.log(this.props.location.state);

//     let { from } = (this.props.location.state as any) || {
//       from: { pathname: "/" },
//     };
//     let { redirectToReferrer } = this.state;

//     if (redirectToReferrer) return <Redirect to={from} />;

//     return (
//       <div>
//         <p>You must log in to view the page at {from.pathname}</p>
//         <button onClick={this.login}>Log in</button>
//         <Link to="/signup">sign up</Link>
//       </div>
//     );
//   }
// }

const Login = () => {
  let location = useLocation();
  console.log(location.state);
  return <div>yeet</div>;
};

// import React, {
//   useContext,
//   useEffect,
//   useState,
//   FunctionComponent,
// } from "react";
// import {
//   Route,
//   Switch,
//   useHistory,
//   Redirect,
//   RouteProps,
//   RouteComponentProps,
//   Link,
//   withRouter,
//   BrowserRouter as Router,
// } from "react-router-dom";
// import { render } from "react-dom";

// import {
//   createMuiTheme,
//   makeStyles,
//   ThemeProvider,
// } from "@material-ui/core/styles";
// import { useAuth, db, firebase } from "./Firebase";
// import SignIn from "./Pages/SignIn";
// import SignOut from "./Pages/SignOut";

// const theme = createMuiTheme({
//   palette: {
//     type: "dark",
//     primary: {
//       light: "#ba8fa4",
//       main: "#ba8fa4",
//       dark: "#8fbaba",
//       contrastText: "#fff",
//     },
//     secondary: {
//       light: "#ff7961",
//       main: "#f44336",
//       dark: "#ba000d",
//       contrastText: "#ba8fa4",
//     },
//   },
//   typography: {
//     fontFamily: ["Lucida Console", "Monaco", "monospace"].join(","),
//     // fontFamily: ["Courier New", "Courier", "monospace"].join(","),
//     // fontFamily: ["Times New Roman", "Times", "serif"].join(","),
//   },
// });

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
// }));

// export default () => {
//   let history = useHistory();
//   let authState = useAuth();

//   if (authState.initializing) return <div>loading</div>;

//   // if (authState.user === null) history.push("/signin");

//   return (
//     <div className="app-routes">
//       <Switch>
//         <Route path="/signin" component={SignIn} />
//         <PrivateRoute path="/" component={Home} />
//       </Switch>
//     </div>
//   );
// };

// const Home = () => {
//   return (
//     <div>
//       home
//       <SignOut />
//     </div>
//   );
// };

// // const PrivateRoute: React.ComponentType<any> = ({
// //   component: Component,
// //   ...rest
// // }) => {
// //   let authState = useAuth();

// //   return (
// //     <Route
// //       {...rest}
// //       render={(props) =>
// //         authState.user !== null ? (
// //           <Component {...props} />
// //         ) : (
// //           <Redirect
// //             to={{
// //               pathname: "/signin",
// //               state: { from: props.location },
// //             }}
// //           />
// //         )
// //       }
// //     />
// //   );
// // };

// function App() {
//   return (
//     <Router>
//       <div>
//         <AuthButton />
//         <ul>
//           <li>
//             <Link to="/public">Public Page</Link>
//           </li>
//           <li>
//             <Link to="/protected">Protected Page</Link>
//           </li>
//           <li>
//             <Link to="/protected_class">Protected Class</Link>
//           </li>
//         </ul>
//         <Route path="/public" component={Public} />
//         <Route path="/login" component={Login} />
//         <PrivateRoute path="/protected" component={Protected} />
//         <PrivateRoute path="/protected_class" component={ProtectedClass} />
//       </div>
//     </Router>
//   );
// }

// const Public = () => <p>Puplic page</p>;

// const Protected = () => <p>Protected page</p>;

// class ProtectedClass extends React.Component<{}, {}> {
//   render() {
//     return <p>Protected class</p>;
//   }
// }

// const fakeAuth = {
//   isAuthenticated: false,
//   authenticate(cb: () => void) {
//     this.isAuthenticated = true;
//     setTimeout(cb, 100); // fake async
//   },
//   signout(cb: () => void) {
//     this.isAuthenticated = false;
//     setTimeout(cb, 100);
//   },
// };

// const AuthButton = withRouter(({ history }) =>
//   fakeAuth.isAuthenticated ? (
//     <p>
//       Welcome!{" "}
//       <button
//         onClick={() => {
//           fakeAuth.signout(() => history.push("/"));
//         }}
//       >
//         Sign out
//       </button>
//     </p>
//   ) : (
//     <p>You are not logged in.</p>
//   )
// );

// const PrivateRoute: React.ComponentType<any> = ({
//   component: Component,
//   ...rest
// }) => {
//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         fakeAuth.isAuthenticated ? (
//           <Component {...props} />
//         ) : (
//           <Redirect
//             to={{
//               pathname: "/login",
//               state: { from: props.location },
//             }}
//           />
//         )
//       }
//     />
//   );
// };

// interface Props extends RouteComponentProps {}
// interface State {
//   redirectToReferrer: boolean;
// }

// class Login extends React.Component<Props, State> {
//   constructor(props: Props) {
//     super(props);
//     this.state = {
//       redirectToReferrer: false,
//     };
//   }

//   login = () => {
//     fakeAuth.authenticate(() => {
//       this.setState({ redirectToReferrer: true });
//     });
//   };

//   render() {
//     let { from } = this.props.location.state || { from: { pathname: "/" } };
//     let { redirectToReferrer } = this.state;

//     if (redirectToReferrer) return <Redirect to={from} />;

//     return (
//       <div>
//         <p>You must log in to view the page at {from.pathname}</p>
//         <button onClick={this.login}>Log in</button>
//       </div>
//     );
//   }
// }

// // const App = () => {
// //   const classes = useStyles();

// //   let history = useHistory();
// //   let location = useLocation();
// //   const [loading, setLoading] = useState(true);
// //   const [newUser, setNewUser] = useState(false);
// //   const [userDetails, setUserDetails] = useState("loading");
// //   const [err, setErr] = useState(null);
// //   let target = new URLSearchParams(useLocation().search).get("target");

// //   let authState = useAuth();

// //   // auth
// //   useEffect(() => {
// //     if (userDetails !== null) {
// //       setNewUser(false);
// //     }
// //   }, [userDetails]);

// //   useEffect(() => {
// //     console.log("authuser", authUser);
// //     if (authUser !== "loading" && authUser !== null) {
// //       // setLoading(true);
// //       console.log(authUser);
// //       db.collection("user_details")
// //         .doc(authUser.uid)
// //         .get()
// //         .then((results) => {
// //           console.log(results);
// //           if (results.exists) {
// //             setUserDetails(results.data());
// //           } else {
// //             setNewUser(true);
// //           }
// //         })
// //         .catch((err) => setErr(err.toString()));
// //       // .finally(() => setLoading(false));
// //     }
// //     // setLoading(false);
// //   }, [authUser]);

// //   if (newUser) {
// //     // console.log(authUser, userDetails, loading);
// //     return <ChooseName setUserDetails={setUserDetails} />;
// //   }

// //   // if not authed, direct to signin
// //   if (
// //     location.pathname !== "/signin" &&
// //     location.pathname !== "/signup" &&
// //     authUser === null
// //   ) {
// //     console.log("signing in");
// //     history.push(`/signin?target=${location.pathname}`);
// //   }

// //   // if authed while on auth page, redirect to original target
// //   if (
// //     (location.pathname === "/signin" || location.pathname === "/signup") &&
// //     authUser !== null
// //   ) {
// //     history.push(`${target}`);
// //   }

// //   if (err !== null) {
// //     return <div>error: {err}</div>;
// //   }

// //   if (
// //     location.pathname !== "/signin" &&
// //     location.pathname !== "/signup" &&
// //     userDetails === "loading"
// //   ) {
// //     return <div>loading</div>;
// //   }
// //   // if authed but no userDetails, show name select page

// //   return (
// //     <div className={classes.root}>
// //       <UserContext.Provider value={userDetails}>
// //         <Banner />
// //         <Switch>
// //           <Route path="/create">
// //             <Create />
// //           </Route>
// //           <Route path="/join/:id">
// //             <Join />
// //           </Route>
// //           <Route path="/game/:id">
// //             <Game />
// //           </Route>
// //           <Route path="/mygames">
// //             <MyGames />
// //           </Route>
// //           <Route path="/signin">
// //             <SignIn />
// //           </Route>
// //           <Route path="/signup">
// //             <SignUp />
// //           </Route>
// //           <Route path="/options">
// //             <Options />
// //           </Route>
// //           <Route path="/instructions">
// //             <Instructions />
// //           </Route>
// //           <Route path="/">
// //             <Home />
// //           </Route>
// //         </Switch>
// //       </UserContext.Provider>
// //     </div>
// //   );
// // };
