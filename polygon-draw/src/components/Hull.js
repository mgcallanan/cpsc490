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

let step = 0.2;
let direction = 1;
let count = 0;
let lerp = 0;
let lerpStep = 0.01;
const maxSteps = 100;

function Hull({ id }) {
  const dispatch = useDispatch();

  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [allVertices, setAllVertices] = useState([]);
  const [hullVertices, setHullVertices] = useState([]);
  const [colorA, setColorA] = useState("");
  const [colorB, setColorB] = useState("");

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
        const hullBboxValues = calculateBBox(eyeVerts);
        const biggerHull = scalePolygon(eyeVerts, hullBboxValues, 1.5);
        console.log(eyeVerts);
        console.log(biggerHull);
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

    // colorA = p5.color(colorARed, colorAGreen, colorABlue);

    const colorAHexStr =
      "#" +
      p5.hex(colorARed, 2) +
      p5.hex(colorAGreen, 2) +
      p5.hex(colorABlue, 2);

    let whiteHexStr = "#FFFFFF";

    let whiteHex = parseInt(whiteHexStr.replace(/^#/, ""), 16);

    let colorAHex = parseInt(colorAHexStr.replace(/^#/, ""), 16);

    // console.log(colorAHexStr, toColor(whiteHex - colorAHex));
    // colorA = p5.color(colorAHexStr);

    const colorBHexStr = toColor(whiteHex - colorAHex);

    // colorB = p5.color(colorBHexStr);

    // colorB =
    //   // colorA = p5.color("#88c4e6");
    //   // colorB = p5.color("#b42b6a");

    //   colorA = p5.color(
    //     p5.random(0, 255),
    //     p5.random(0, 255),
    //     p5.random(0, 100)
    //   );
    // colorB = p5.color(
    //   p5.random(200, 255),
    //   p5.random(100, 255),
    //   p5.random(0, 255)
    // );
    setColorA(colorAHexStr);
    setColorB(colorBHexStr);
    setCanvasHeight(p5.height);
    setCanvasWidth(p5.width);
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
      //   console.log(lerp, lerpStep);
      let mixTarget = lerp;
      mix = mix + (mixTarget - mix) * easing;

      easedColor = p5.lerpColor(p5.color(colorA), p5.color(colorB), mix);
    }
    // console.log(easedColor);
    p5.background(easedColor);

    if (hullVertices.length) {
      // count += 1;

      const newVertices = placeAtBottom(hullVertices, p5.height, p5.width);

      p5.stroke(0, 0, 0);
      p5.strokeWeight(5);

      p5.noFill();
      p5.fill(255, 255, 255);
      p5.beginShape();
      // console.log(count, step, maxSteps);
      if (count < 0 || count > maxSteps) {
        //   count = 0;
        // console.log(count, step);
        direction *= -1;
        // break;
      }

      for (let i = 0; i < newVertices.length; i++) {
        p5.vertex(newVertices[i][0], newVertices[i][1] + step * count);
        // p5.vertex(newVertices[i][0], newVertices[i][1]);
      }
      p5.endShape(p5.CLOSE);
      // console.log(count * step);
      count += direction < 0 ? -1 : 1;
    }

    // draw hull
  };

  return (
    <div className="hull-container">
      <Sketch setup={setup} draw={draw} />
    </div>
  );

  // return (
  //   <div>
  //     <div className="hull-container">
  //       <Sketch setup={setup} draw={draw} />
  //     </div>
  //   </div>
  // );
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
