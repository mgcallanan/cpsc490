import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "../styles/artist.scss";
import { useNavigate } from "react-router-dom";
import * as userActions from "../redux/actions/userActions";
import { SOCKET_URL } from "../utils/ipAddr";

function Artist(props) {
  const [projectorID, setProjectorID] = useState("");
  const [userName, setUserName] = useState("");
  const [k, setK] = useState(20);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ws, setWs] = useState(new WebSocket(SOCKET_URL));

  const handleIDChange = (event) => {
    setProjectorID(event.target.value.toUpperCase());
  };
  const handleNameChange = (event) => {
    setUserName(event.target.value.toUpperCase());
  };
  const handleSubmit = (event) => {
    dispatch({
      type: userActions.SET_CONNECTED_TO_PROJECTOR_ID,
      payload: projectorID,
    });
    const message = {
      type: "connectionInitiated",
      userName: userName,
      projectorID: projectorID,
    };
    ws.send(JSON.stringify(message));

    navigate("/prompt");
  };

  return (
    <div className="artist-container">
      <div className="id-container">
        <form onSubmit={handleSubmit}>
          <label>NAME YOUR FIGURE:</label>
          <input
            type="text"
            name="Name"
            style={{ textTransform: "uppercase" }}
            onChange={handleNameChange}
          />
          <label>PROJECTOR ID:</label>
          <input
            type="text"
            name="projID"
            style={{ textTransform: "uppercase" }}
            onChange={handleIDChange}
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
}

export default Artist;
