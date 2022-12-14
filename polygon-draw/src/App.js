import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Artist from "./components/Artist";
import Login from "./components/Login";
import Projector from "./components/Projector";
import Prompt from "./components/Prompt";
import "./styles/main.scss";

function App() {
  return (
    <Router>
      {/* <div className="container">
        <Prompt />
      </div> */}
      <Routes>
        <Route exact path="/" element={<Login />}></Route>
        <Route exact path="/prompt" element={<Prompt />}></Route>
        <Route exact path="/projector" element={<Projector />}></Route>
        <Route exact path="/artist" element={<Artist />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
