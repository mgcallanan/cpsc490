import React, { useState } from "react";
import { useDispatch } from "react-redux";
import P5Sketch from "./P5Sketch";
import "../styles/projector.scss";
import BodySketch from "./BodySketch";
import * as shapeActions from "../redux/actions/shapeActions";
import { getProjectors, addProjector } from "../services/dataStore";

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

function Projector(props) {
  const [projectorID, setProjectorID] = useState("");
  const [displayHull, setDisplayHull] = useState(true);
  const [k, setK] = useState(20);
  const dispatch = useDispatch();

  getProjectors().then((response) => {
    console.log(response);
    if (!projectorID) {
      let newProjID = Math.random().toString(36).toUpperCase().slice(2, 4);
      while (idExists(newProjID, response)) {
        newProjID = Math.random().toString(36).toUpperCase().slice(2, 4);
      }
      setProjectorID(newProjID);
      const newProj = {
        id: newProjID,
        allVertices: [],
      };
      addProjector(newProj);
    }
  });

  return (
    <div className="projector-container">
      <div className="projector-header">
        <h1>PROJECTOR ID</h1>
      </div>
      <div className="id-container">
        <div>{projectorID.slice(0, 1)}</div>
        <div>{projectorID.slice(1, 2)}</div>
      </div>
    </div>
  );
}

export default Projector;
