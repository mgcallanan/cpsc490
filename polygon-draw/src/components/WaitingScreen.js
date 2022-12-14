import React from "react";
import "../styles/projector.scss";
import ParticleSystem from "./ParticleSystem";

function WaitingScreen({ userName }) {
  return (
    <div className="waiting-scr-container">
      <ParticleSystem userName={userName} />
    </div>
  );
}

export default WaitingScreen;
