import React, { useState } from "react";
import { useDispatch } from "react-redux";
import P5Sketch from "./P5Sketch";
import "../styles/artist.scss";
import BodySketch from "./BodySketch";
import * as shapeActions from "../redux/actions/shapeActions";
import { getProjectors, addProjector } from "../services/dataStore";
import { useNavigate } from "react-router-dom";
import * as userActions from "../redux/actions/userActions";
import { SOCKET_URL } from "../utils/ipAddr";

const BODY_PARTS = [
  "Head",
  "Torso",
  "Right Arm",
  "Left Arm",
  "Right Leg",
  "Left Leg",
];

const idExists = (projID, projectors) => {
  return projectors.some((e) => e.id === projID);
};

function Artist(props) {
  const [projectorID, setProjectorID] = useState("");
  const [userName, setUserName] = useState("");
  const [displayHull, setDisplayHull] = useState(true);
  const [k, setK] = useState(20);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ws, setWs] = useState(new WebSocket(SOCKET_URL));

  //   getProjectors().then((response) => {
  //     console.log(response);
  //     if (!projectorID) {
  //       let newProjID = Math.random().toString(36).toUpperCase().slice(2, 4);
  //       while (idExists(newProjID, response)) {
  //         newProjID = Math.random().toString(36).toUpperCase().slice(2, 4);
  //       }
  //       setProjectorID(newProjID);
  //       const newProj = {
  //         id: newProjID,
  //         allVertices: [],
  //       };
  //       addProjector(newProj);
  //     }
  //   });

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
    console.log(projectorID);
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
      {/* <div className="artist-header">
        <h1>WHICH PROJECTOR ARE YOU IN FRONT OF?</h1>
      </div> */}
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
