import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

// import MomentUtils from "@date-io/moment";
// import dayjs from "dayjs";
// import DayjsUtils from "dayjs";
// import "dayjs/locale/en-au";
import DateFnsUtils from "@date-io/date-fns";
import { enAU } from "date-fns/locale";

// import white from "@material-ui/core/colors/white";
// import green from "@material-ui/core/colors/green";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory,
} from "react-router-dom";

// dayjs.locale("en-au");
const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      light: "#ba8fa4",
      main: "#ba8fa4",
      dark: "#8fbaba",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#ba8fa4",
    },
  },
  typography: {
    fontFamily: ["Lucida Console", "Monaco", "monospace"].join(","),
    // fontFamily: ["Courier New", "Courier", "monospace"].join(","),
    // fontFamily: ["Times New Roman", "Times", "serif"].join(","),
  },
});

ReactDOM.render(
  <React.StrictMode>
    <MuiPickersUtilsProvider locale={enAU} utils={DateFnsUtils}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Router>
    </MuiPickersUtilsProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
