import React, { useEffect, useState } from "react";
import "../styles/projector.scss";
import { getProjectors, addProjector } from "../services/dataStore";
import { SOCKET_URL } from "../utils/ipAddr";
import Hull from "./Hull";
import WaitingScreen from "./WaitingScreen";

const idExists = (projID, projectors) => {
  return projectors.some((e) => e.id === projID);
};

function Projector(props) {
  const [projectorID, setProjectorID] = useState("");
  const [bodyDone, setBodyDone] = useState(false);
  const [connectionInitiated, setConnectionInitiated] = useState(false);
  const [userNameConnected, setUserNameConnected] = useState("");
  const [ws, setWs] = useState(new WebSocket(SOCKET_URL));

  useEffect(() => {
    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.type === "submit") {
        if (message.projectorID === projectorID) {
          setBodyDone(true);
        }
      }
      if (message.type === "connectionInitiated") {
        if (message.projectorID === projectorID) {
          setConnectionInitiated(true);
          setUserNameConnected(message.userName);
        }
      }
    };

    return () => {
      ws.onclose = () => {
        console.log("WebSocket Disconnected");
        setWs(new WebSocket(SOCKET_URL));
      };
    };
  }, [ws.onmessage, ws.onopen, ws.onclose]);

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

  return (
    <div className="projector-container">
      {bodyDone ? (
        <div className="result-container">
          <Hull id={projectorID} />
        </div>
      ) : (
        <>
          {connectionInitiated ? (
            <WaitingScreen userName={userNameConnected} />
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
        </>
      )}
    </div>
  );
}

export default Projector;
