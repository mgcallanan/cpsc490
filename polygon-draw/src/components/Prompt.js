import React, { useState } from "react";
import P5Sketch from "./P5Sketch";
import "../styles/prompt.scss";
import BodySketch from "./BodySketch";

const BODY_PARTS = [
  "Head",
  "Torso",
  "Right Arm",
  "Left Arm",
  "Right Leg",
  "Left Leg",
];

function Prompt(props) {
  const [newScreen, setNewScreen] = useState(0);

  return (
    <div className="prompt-container">
      <div className="prompt-header">
        <h1>
          Draw Your Figure's <br />
          {BODY_PARTS[newScreen]}
        </h1>
      </div>
      <div className="sketches-container">
        <div className="draw-sketch-container">
          <P5Sketch bodyPart={BODY_PARTS[newScreen]} />
        </div>
        <div className="body-sketch-container">
          <BodySketch bodyPart={BODY_PARTS[newScreen]} />
        </div>
      </div>
      <div className="prompt-done-btn-container">
        <button
          className="prompt-done-btn"
          onClick={() => setNewScreen(newScreen + 1)}
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default Prompt;
