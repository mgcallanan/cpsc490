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
  findEyeIntersectionPoint,
} from "../utils/translatePart";
import { setVertices, storeVertices, getVertices } from "../services/dataStore";
import { generateMoreVertices } from "../utils/vertices";

let colorA, colorB;
let step = 0.5;
let count = 0;

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
        console.log(response.allVertices);
        setAllVertices(response.allVertices);
        const newHull = hull(response.allVertices, 40);
        const eyeVerts = findEyeIntersectionPoint(
          newHull,
          response.leftEye,
          response.rightEye
        );
        console.log(eyeVerts);
        setHullVertices(eyeVerts);
      }
    });
  }

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);

    // colorA = p5.color("#88c4e6");
    // colorB = p5.color("#b42b6a");

    colorA = p5.color(p5.random(0, 255), p5.random(0, 255), p5.random(0, 100));
    colorB = p5.color(
      p5.random(200, 255),
      p5.random(100, 255),
      p5.random(0, 255)
    );

    setCanvasHeight(p5.height);
    setCanvasWidth(p5.width);
  };

  let easing = 0.02;
  let mix = 0;
  let lerp = Math.random();

  const draw = (p5) => {
    let easedColor = p5.color(0, 0, 0);

    if (colorA && colorB) {
      let mixTarget = lerp;
      mix = mix + (mixTarget - mix) * easing;

      easedColor = p5.lerpColor(colorA, colorB, mix);
      lerp = Math.random();
    }
    p5.background(easedColor);

    if (hullVertices.length) {
      count += 1;

      const newVertices = placeAtBottom(hullVertices, p5.height, p5.width);

      p5.stroke(0, 0, 0);
      p5.strokeWeight(5);

      p5.noFill();
      p5.fill(255, 255, 255);
      p5.beginShape();
      for (let i = 0; i < newVertices.length; i++) {
        // console.log(count, step);
        if (
          newVertices[i][1] + step * count <= 0 ||
          newVertices[i][1] + step * count >= p5.height
        ) {
          //   count = 0;
          step *= -1;
        }
        p5.vertex(newVertices[i][0], newVertices[i][1] + step * count);
      }
      p5.endShape(p5.CLOSE);
    }

    count += step < 0 ? -1 : 1;

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
