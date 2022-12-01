import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useWebSocket, { useSocketIO } from "react-use-websocket";
import P5Sketch from "./P5Sketch";
import "../styles/projector.scss";
import BodySketch from "./BodySketch";
import * as shapeActions from "../redux/actions/shapeActions";
import { getProjectors, addProjector } from "../services/dataStore";
import { SERVER_IP_ADDR } from "../utils/ipAddr";
import Hull from "./Hull";

// const socketURL = "ws://localhost:3000/ws";
const URL = `ws://${SERVER_IP_ADDR}:9000`;

const idExists = (projID, projectors) => {
  return projectors.some((e) => e.id === projID);
};

function Projector(props) {
  const [projectorID, setProjectorID] = useState("");
  const [bodyDone, setBodyDone] = useState(false);
  const dispatch = useDispatch();
  const [ws, setWs] = useState(new WebSocket(URL));

  useEffect(() => {
    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log(message);
      if (message.projectorID === projectorID) {
        setBodyDone(true);
      }
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

  getProjectors().then((response) => {
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

  // useEffect(() => {
  //   if (lastMessage != null) {
  //     console.log(lastMessage);
  //   }
  // }, [lastMessage]);

  return (
    <div className="projector-container">
      {bodyDone ? (
        <div className="id-container">
          <Hull id={projectorID} />
        </div>
      ) : (
        <>
          <div className="projector-header">
            <h1>PROJECTOR ID</h1>
          </div>
          <div className="id-container">
            <div>{projectorID.slice(0, 1)}</div>
            <div>{projectorID.slice(1, 2)}</div>
          </div>
        </>
      )}
    </div>
  );
}

export default Projector;
