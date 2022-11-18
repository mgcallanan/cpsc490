import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import P5Sketch from "./components/P5Sketch";
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
      </Routes>
    </Router>
  );
}

export default App;
