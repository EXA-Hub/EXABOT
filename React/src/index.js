import React from "react";
import ReactDOM from "react-dom";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    {/* <BrowserRouter>
      <Routes>
        <Route path="/:guildID?">
        
        </Route>
      </Routes>
    </BrowserRouter> */}
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
