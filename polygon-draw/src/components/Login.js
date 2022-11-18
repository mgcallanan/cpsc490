import React from "react";
import { useDispatch } from "react-redux";
import * as userActions from "../redux/actions/userActions";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../styles/login.scss";

function Login() {
  const dispatch = useDispatch();
  const handleArtistClick = () => {
    dispatch({
      type: userActions.SET_IS_ARTIST,
      payload: true,
    });
  };

  const handleProjectorClick = () => {
    dispatch({
      type: userActions.SET_IS_PROJECTOR,
      payload: true,
    });
  };

  return (
    <div className="login-container">
      <h2>ARE YOU AN:</h2>
      <button onClick={handleArtistClick}>ARTIST</button>
      <button onClick={handleProjectorClick}>PROJECTOR</button>
      <h1>?</h1>
    </div>
  );
}

export default Login;
