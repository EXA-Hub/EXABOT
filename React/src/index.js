import React from "react";
import ReactDOM from "react-dom";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import App from "./App";

// optional configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: "30px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

const Root = () => (
  <React.StrictMode>
    <AlertProvider template={AlertTemplate} {...options}>
      {/* <BrowserRouter>
    <Routes>
      <Route path="/:guildID?">

      </Route>
    </Routes>
  </BrowserRouter> */}
      <App />
    </AlertProvider>
  </React.StrictMode>
);

ReactDOM.render(<Root />, document.getElementById("root"));
