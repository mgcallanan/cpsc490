import React, { useState, useCallback, useEffect, useContext } from "react";
import { useDispatch, connect } from "react-redux";
import P5Sketch from "./P5Sketch";
import "../styles/prompt.scss";
import BodySketch from "./BodySketch";
import * as shapeActions from "../redux/actions/shapeActions";
import { SERVER_IP_ADDR } from "../utils/ipAddr";

const BODY_PARTS = [
  "Head",
  "Torso",
  "Right Arm",
  "Left Arm",
  "Right Leg",
  "Left Leg",
];

const socketURL = "ws://localhost:3000/ws";
const URL = `ws://${SERVER_IP_ADDR}:9000`;

function Prompt(props) {
  const { allVertices, connectedToProjectorID } = props;
  console.log(allVertices);

  const [newScreen, setNewScreen] = useState(0);
  const [displayHull, setDisplayHull] = useState(true);
  const [k, setK] = useState(20);
  const [ws, setWs] = useState(new WebSocket(URL));

  const dispatch = useDispatch();

  const submitMessage = (type, vertices, projectorID) => {
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
        setWs(new WebSocket(URL));
      };
    };
  }, [ws.onmessage, ws.onopen, ws.onclose]);

  // const { sendMessage, lastMessage, readyState } = useWebSocket(socketURL, {
  //   onOpen: () => console.log("WebSocket connection opened."),
  //   onClose: () => console.log("WebSocket connection closed."),
  //   shouldReconnect: (closeEvent) => true,
  //   onMessage: (event) => console.log(event),
  // });

  const handleDone = () => {
    // sendMessage("Hello");
    dispatch({
      type: shapeActions.SET_BODY_COMPLETE,
      payload: true,
    });
    console.log(allVertices);
    submitMessage("submit", allVertices, connectedToProjectorID);
    // sendMessage("hello");
    console.log("yay");
  };

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
              : // () => handleDone()
                () => handleDone()
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

const mapStateToProps = (state) => {
  return {
    allVertices: state.shapes.allVertices,
    connectedToProjectorID: state.users.connectedToProjectorID,
  };
};

export default connect(mapStateToProps)(Prompt);
