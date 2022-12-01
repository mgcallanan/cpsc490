import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import Sketch from "react-p5/";
import hull from "hull.js";
import "../styles/hull.scss";
import * as shapeActions from "../redux/actions/shapeActions";
import {
  calculateBBox,
  getPolygonInfo,
  scalePolygon,
  placePolygon,
  placeAtBottom,
} from "../utils/translatePart";
import { setVertices, storeVertices, getVertices } from "../services/dataStore";

function Hull({ id }) {
  const dispatch = useDispatch();

  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [allVertices, setAllVertices] = useState([]);
  const [hullVertices, setHullVertices] = useState([]);

  if (!allVertices.length) {
    getVertices(id).then((response) => {
      console.log(response);
      console.log(response.allVertices);
      if (response.allVertices) {
        setAllVertices(response.allVertices);
        setHullVertices(hull(response.allVertices, 120));
      }
    });
  }

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth * 0.8, p5.windowHeight * 0.85).parent(
      canvasParentRef
    );

    setCanvasHeight(p5.height);
    setCanvasWidth(p5.width);
  };

  let count = 1;

  const draw = (p5) => {
    p5.background(0);

    if (hullVertices.length) {
      const newVertices = placeAtBottom(hullVertices, p5.height, p5.width);
      //   const hullVertices = hull(allVertices, 100);
      //   console.log(hullVertices);
      p5.stroke(255, 255, 255);
      p5.strokeWeight(5);

      p5.noFill();
      p5.beginShape();
      for (let i = 0; i < newVertices.length; i++) {
        p5.vertex(newVertices[i][0], newVertices[i][1]);
      }
      p5.endShape(p5.CLOSE);
    }

    if (count === 1) {
      if (hullVertices.length) {
        console.log(placeAtBottom(hullVertices, canvasHeight, canvasWidth));
        count = 2;
      }
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
