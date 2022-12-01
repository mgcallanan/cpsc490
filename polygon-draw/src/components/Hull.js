import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import Sketch from "react-p5/";
import hull from "hull.js";
import "../styles/bodySketch.scss";
import * as shapeActions from "../redux/actions/shapeActions";
import {
  calculateBBox,
  getPolygonInfo,
  scalePolygon,
  placePolygon,
} from "../utils/translatePart";
import { setVertices, storeVertices, getVertices } from "../services/dataStore";

function Hull({ id }) {
  const dispatch = useDispatch();

  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [allVertices, setAllVertices] = useState([]);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth * 0.8, p5.windowHeight * 0.85).parent(
      canvasParentRef
    );

    setCanvasHeight(p5.height);
    setCanvasWidth(p5.width);
  };
  if (!allVertices.length) {
    getVertices(id).then((response) => {
      console.log(response);
      console.log(response.allVertices);
      if (response.allVertices) {
        setAllVertices(response.allVertices);
      }
    });
  }

  const draw = (p5) => {
    p5.background(0);

    //   console.log("ALLLLL DONEEEE");
    if (allVertices.length) {
      const hullVertices = hull(allVertices, 100);
      p5.stroke(0, 0, 255);
      p5.strokeWeight(5);

      p5.noFill();
      p5.beginShape();
      for (let i = 0; i < hullVertices.length; i++) {
        p5.vertex(hullVertices[i][0], hullVertices[i][1]);
      }
      p5.endShape(p5.CLOSE);
    }

    // draw hull
  };

  return <Sketch setup={setup} draw={draw} />;
}

const mapStateToProps = (state) => {
  return {
    headVertices: state.shapes.headVertices,
    torsoVertices: state.shapes.torsoVertices,
    rightArmVertices: state.shapes.rightArmVertices,
    leftArmVertices: state.shapes.leftArmVertices,
    rightLegVertices: state.shapes.rightLegVertices,
    leftLegVertices: state.shapes.leftLegVertices,
    headComplete: state.shapes.headComplete,
    torsoComplete: state.shapes.torsoComplete,
    rightArmComplete: state.shapes.rightArmComplete,
    leftArmComplete: state.shapes.leftArmComplete,
    rightLegComplete: state.shapes.rightLegComplete,
    leftLegComplete: state.shapes.leftLegComplete,
    bodyComplete: state.shapes.bodyComplete,
    projectorID: state.users.projectorID,
    connectedToProjectorID: state.users.connectedToProjectorID,
  };
};
export default connect(mapStateToProps)(Hull);
