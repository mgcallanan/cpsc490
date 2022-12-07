import React, { useState, useCallback, useEffect, useContext } from "react";
import { useDispatch, connect } from "react-redux";
import P5Sketch from "./P5Sketch";
import "../styles/prompt.scss";
import BodySketch from "./BodySketch";
import * as shapeActions from "../redux/actions/shapeActions";
import { SOCKET_URL } from "../utils/ipAddr";
import { useNavigate } from "react-router-dom";

const BODY_PARTS = [
  "Head",
  "Torso",
  "Right Arm",
  "Left Arm",
  "Right Leg",
  "Left Leg",
];

function Prompt(props) {
  const { allVertices, connectedToProjectorID } = props;

  const [newScreen, setNewScreen] = useState(0);
  const [displayHull, setDisplayHull] = useState(true);
  const [k, setK] = useState(20);
  const [ws, setWs] = useState(new WebSocket(SOCKET_URL));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitMessage = (type, vertices) => {
    const message = {
      type: type,
      vertices: vertices,
      projectorID: connectedToProjectorID,
    };
    console.log(message);
    ws.send(JSON.stringify(message));
  };

  useEffect(() => {
    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log(message);
    };

    return () => {
      ws.onclose = () => {
        console.log("WebSocket Disconnected");
        setWs(new WebSocket(SOCKET_URL));
      };
    };
  }, [ws.onmessage, ws.onopen, ws.onclose]);

  // const { sendMessage, lastMessage, readyState } = useWebSocket(socketURL, {
  //   onOpen: () => console.log("WebSocket connection opened."),
  //   onClose: () => console.log("WebSocket connection closed."),
  //   shouldReconnect: (closeEvent) => true,
  //   onMessage: (event) => console.log(event),
  // });

  if (!connectedToProjectorID) {
    navigate("/artist");
    // return;
  }

  const handleDone = () => {
    // sendMessage("Hello");
    dispatch({
      type: shapeActions.SET_BODY_COMPLETE,
      payload: true,
    });
    submitMessage("submit", allVertices, connectedToProjectorID);
    // sendMessage("hello");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  });

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
        {/* {newScreen < BODY_PARTS.length ? (
          <div></div>
        ) : (
          <button
            className="prompt-done-btn"
            onClick={() => setDisplayHull(!displayHull)}
          >
            O
          </button>
        )} */}
        <button
          className="prompt-done-btn"
          onClick={
            newScreen < BODY_PARTS.length
              ? () => setNewScreen(newScreen + 1)
              : // () => handleDone()
                () => handleDone()
          }
        >
          {newScreen < BODY_PARTS.length ? "Next Part" : "Convert"}
        </button>
        {/* {newScreen < BODY_PARTS.length ? (
          <div></div>
        ) : (
          <button className="prompt-done-btn" onClick={() => setK(k + 10)}>
            K ^
          </button>
        )} */}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    allVertices: state.shapes.allVertices,
    connectedToProjectorID: state.users.connectedToProjectorID,
  };
};

export default connect(mapStateToProps)(Prompt);
