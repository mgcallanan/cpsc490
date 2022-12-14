import React, { useState } from "react";
import { connect } from "react-redux";
import Sketch from "react-p5/";
import hull from "hull.js";
import "../styles/hull.scss";
import {
  calculateBBox,
  scalePolygon,
  placeAtBottom,
  findEyeIntersectionPoint,
} from "../utils/translatePart";
import { getVertices } from "../services/dataStore";

let step = 0.2;
let direction = 1;
let count = 0;
let lerp = 0;
let lerpStep = 0.01;
const maxSteps = 100;

function Hull({ id }) {
  const [allVertices, setAllVertices] = useState([]);
  const [hullVertices, setHullVertices] = useState([]);
  const [colorA, setColorA] = useState("");
  const [colorB, setColorB] = useState("");

  if (!allVertices.length) {
    getVertices(id).then((response) => {
      if (response.allVertices) {
        setAllVertices(response.allVertices);
        const newHull = hull(response.allVertices, 40);
        const eyeVerts = findEyeIntersectionPoint(
          newHull,
          response.leftEye,
          response.rightEye
        );
        const hullBboxValues = calculateBBox(eyeVerts);
        const biggerHull = scalePolygon(eyeVerts, hullBboxValues, 2);

        setHullVertices(biggerHull.vertices);
      }
    });
  }

  const toColor = (d) => {
    var c = Number(d).toString(16);
    return "#" + ("000000".substr(0, 6 - c.length) + c.toUpperCase());
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    let colorARed = p5.random(0, 255);
    let colorAGreen = p5.random(0, 255);
    let colorABlue = p5.random(0, 255);

    const colorAHexStr =
      "#" +
      p5.hex(colorARed, 2) +
      p5.hex(colorAGreen, 2) +
      p5.hex(colorABlue, 2);

    let whiteHexStr = "#FFFFFF";

    let whiteHex = parseInt(whiteHexStr.replace(/^#/, ""), 16);

    let colorAHex = parseInt(colorAHexStr.replace(/^#/, ""), 16);

    const colorBHexStr = toColor(whiteHex - colorAHex);

    setColorA(colorAHexStr);
    setColorB(colorBHexStr);
  };

  let easing = 0.03;
  let mix = 0;

  const draw = (p5) => {
    let easedColor = p5.color(0, 0, 0);

    if (colorA && colorB) {
      if (lerp >= 1 || lerp < 0) {
        lerpStep *= -1;
      }
      lerp += lerpStep;
      let mixTarget = lerp;
      mix = mix + (mixTarget - mix) * easing;

      easedColor = p5.lerpColor(p5.color(colorA), p5.color(colorB), mix);
    }
    p5.background(easedColor);

    if (hullVertices.length) {
      const newVertices = placeAtBottom(hullVertices, p5.height, p5.width);

      p5.stroke(0, 0, 0);
      p5.strokeWeight(5);

      p5.noFill();
      p5.fill(255, 255, 255);
      p5.beginShape();
      if (count < 0 || count > maxSteps) {
        direction *= -1;
      }

      for (let i = 0; i < newVertices.length; i++) {
        p5.vertex(newVertices[i][0], newVertices[i][1] + step * count);
      }
      p5.endShape(p5.CLOSE);
      count += direction < 0 ? -1 : 1;
    }

    // draw hull
  };

  return (
    <div className="hull-container">
      <Sketch setup={setup} draw={draw} />
    </div>
  );
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
