import React, { useState } from "react";
import { useDispatch } from "react-redux";
import P5Sketch from "./P5Sketch";
import "../styles/prompt.scss";
import BodySketch from "./BodySketch";
import * as shapeActions from "../redux/actions/shapeActions";

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
  const [displayHull, setDisplayHull] = useState(true);
  const [k, setK] = useState(20);
  const dispatch = useDispatch();

  return (
    <div className="prompt-container">
      <div className="prompt-header">
        <h1>
          {newScreen < BODY_PARTS.length ? (
            <>
              Draw Your Figure's <br />
              {BODY_PARTS[newScreen]}
            </>
          ) : (
            "All Done!"
          )}
        </h1>
      </div>
      <div className="sketches-container">
        <div className="draw-sketch-container">
          <P5Sketch bodyPart={BODY_PARTS[newScreen]} />
        </div>
        <div className="body-sketch-container">
          <BodySketch
            bodyPart={BODY_PARTS[newScreen]}
            displayHull={displayHull}
            k={k}
          />
        </div>
      </div>
      <div className="prompt-done-btn-container">
        {newScreen < BODY_PARTS.length ? (
          <div></div>
        ) : (
          <button
            className="prompt-done-btn"
            onClick={() => setDisplayHull(!displayHull)}
          >
            O
          </button>
        )}
        <button
          className="prompt-done-btn"
          onClick={
            newScreen < BODY_PARTS.length
              ? () => setNewScreen(newScreen + 1)
              : () =>
                  dispatch({
                    type: shapeActions.SET_BODY_COMPLETE,
                    payload: true,
                  })
          }
        >
          {newScreen < BODY_PARTS.length ? "Next Part" : "Convert"}
        </button>
        {newScreen < BODY_PARTS.length ? (
          <div></div>
        ) : (
          <button className="prompt-done-btn" onClick={() => setK(k + 10)}>
            K ^
          </button>
        )}
      </div>
    </div>
  );
}

export default Prompt;
