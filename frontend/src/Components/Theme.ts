import {
  ThemeProvider,
  createMuiTheme,
  ThemeOptions,
} from "@material-ui/core/styles";
import { Shadows } from "@material-ui/core/styles/shadows";

export const baseThemeOptions: ThemeOptions = {
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
      main: "#494949",
      dark: "#a4ba8f",
      contrastText: "#ba8fa4",
    },
  },
  shadows: Array(25).fill("none") as Shadows,
  typography: {
    fontFamily: ["Lucida Console", "Monaco", "monospace"].join(","),
  },
};
