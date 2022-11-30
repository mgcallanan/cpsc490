import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as userActions from "../redux/actions/userActions";
import { useNavigate } from "react-router-dom";
import { addProjector, getProjectors } from "../services/dataStore";

import "../styles/login.scss";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleArtistClick = () => {
    dispatch({
      type: userActions.SET_IS_ARTIST,
      payload: true,
    });
    navigate("/artist");
  };

  const handleProjectorClick = () => {
    dispatch({
      type: userActions.SET_IS_PROJECTOR,
      payload: true,
    });
    navigate("/projector");
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
