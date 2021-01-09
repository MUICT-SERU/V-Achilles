import { Provider } from "react-redux";
import { store } from "./redux/store";

import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

import Routes from "./routes";
import { BrowserRouter as Router } from "react-router-dom";

import theme from "./themes";
import "./App.css";

function App() {
  return (
    <Router>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Routes />
        </Provider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
