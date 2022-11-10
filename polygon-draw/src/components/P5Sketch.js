import React from "react";
import { useDispatch } from "react-redux";
import Sketch from "react-p5/";
import hull from "hull.js";
import "../styles/p5sketch.scss";
import * as shapeActions from "../redux/actions/shapeActions";

function P5Sketch({ bodyPart }) {
  let currentLineOrigin = [];
  let allVertices = [];
  let currentVertices = [];
  let hullVertices = [];
  let k = 20;
  let displayHull = false;
  let shapes = [];
  let lines = [];
  let firstClicked = false;
  let doneShape = true;
  const dispatch = useDispatch();

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth * 0.8, p5.windowHeight * 0.75).parent(
      canvasParentRef
    );
  };

  const draw = (p5) => {
    //   p5.background(0);
    p5.clear();
    p5.background("rgba(0,0,0, 0.60)");
    p5.stroke(255, 255, 255);
    p5.strokeWeight(5);

    if (displayHull) {
      p5.stroke(0, 0, 255);
      p5.noFill();
      p5.beginShape();
      for (let i = 0; i < hullVertices.length; i++) {
        p5.vertex(hullVertices[i][0], hullVertices[i][1]);
      }
      p5.endShape(p5.CLOSE);
    }

    // Draw shapes that have been drawn
    if (!displayHull) {
      // Draw current line that hasn't been set yet
      if (p5.mouseIsPressed) {
        p5.line(
          currentLineOrigin[0],
          currentLineOrigin[1],
          p5.mouseX,
          p5.mouseY
        );
        p5.stroke(255, 255, 255);
        p5.noFill();
        p5.ellipse(p5.mouseX, p5.mouseY, 20);
      }

      for (let i = 0; i < shapes.length; i++) {
        let currShape = shapes[i];
        p5.noFill();
        p5.stroke(255, 255, 255);
        p5.strokeWeight(5);
        p5.beginShape();
        for (let j = 0; j < currShape.length; j++) {
          p5.vertex(currShape[j][0], currShape[j][1]);
        }
        p5.endShape(p5.CLOSE);
      }

      // Draw lines of the vertex
      for (let i = 0; i < lines.length; i++) {
        p5.stroke(255, 255, 255);
        p5.strokeWeight(5);
        p5.line(lines[i][0], lines[i][1], lines[i][2], lines[i][3]);
      }
    }

    // To get red dots at every vertex
    for (let i = 0; i < allVertices.length; i++) {
      p5.fill(255, 0, 0);
      p5.noStroke();
      p5.ellipse(allVertices[i][0], allVertices[i][1], 10);
    }
  };

  /* full screening will change the size of the canvas */
  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  // function mouseDragged() {
  //   console.log("hi");
  //   // currentLineOrigin = [p5.mouseX, p5.mouseY];
  // }

  const mouseReleased = (_p5, event) => {
    if (
      _p5.mouseX <= _p5.width &&
      _p5.mouseX >= 0 &&
      _p5.mouseY <= _p5.height &&
      _p5.mouseY >= 0
    ) {
      if (currentVertices.length) {
        if (
          Math.abs(_p5.mouseX - currentVertices[0][0]) <= 20 &&
          Math.abs(_p5.mouseY - currentVertices[0][1]) <= 20
        ) {
          console.log("DONE");
          doneShape = true;
          currentLineOrigin = [];
          currentVertices = [
            ...currentVertices,
            [currentVertices[0][0], currentVertices[0][1]],
          ];
          //   currentVertices.push([currentVertices[0][0], currentVertices[0][1]]);
          //   if (bodyPart === "Head") {
          //     dispatch({
          //       type: shapeActions.UPDATE_HEAD_VERTICES,
          //       payload: currentVertices,
          //     });
          //   } else if (bodyPart === "Torso") {
          //     dispatch({
          //       type: shapeActions.UPDATE_TORSO_VERTICES,
          //       payload: currentVertices,
          //     });
          //   } else if (bodyPart === "Right Arm") {
          //     dispatch({
          //       type: shapeActions.UPDATE_RIGHT_ARM_VERTICES,
          //       payload: currentVertices,
          //     });
          //   } else if (bodyPart === "Left Arm") {
          //     dispatch({
          //       type: shapeActions.UPDATE_LEFT_ARM_VERTICES,
          //       payload: currentVertices,
          //     });
          //   } else if (bodyPart === "Right Leg") {
          //     dispatch({
          //       type: shapeActions.UPDATE_RIGHT_LEG_VERTICES,
          //       payload: currentVertices,
          //     });
          //   } else if (bodyPart === "Left Leg") {
          //     dispatch({
          //       type: shapeActions.UPDATE_LEFT_LEG_VERTICES,
          //       payload: currentVertices,
          //     });
          //   }
          shapes.push(currentVertices);

          currentVertices = [];
          return;
        }
      }
      lines.push([
        currentLineOrigin[0],
        currentLineOrigin[1],
        _p5.mouseX,
        _p5.mouseY,
      ]);
      currentLineOrigin = [_p5.mouseX, _p5.mouseY];
      firstClicked = !firstClicked;
      allVertices.push([_p5.mouseX, _p5.mouseY]);
      // currentVertices.push([_p5.mouseX, _p5.mouseY]);
      currentVertices = [...currentVertices, [_p5.mouseX, _p5.mouseY]];
      allVertices.push([_p5.mouseX, _p5.mouseY]);

      if (bodyPart === "Head") {
        dispatch({
          type: shapeActions.UPDATE_HEAD_VERTICES,
          payload: currentVertices,
        });
      } else if (bodyPart === "Torso") {
        dispatch({
          type: shapeActions.UPDATE_TORSO_VERTICES,
          payload: currentVertices,
        });
      } else if (bodyPart === "Right Arm") {
        dispatch({
          type: shapeActions.UPDATE_RIGHT_ARM_VERTICES,
          payload: currentVertices,
        });
      } else if (bodyPart === "Left Arm") {
        dispatch({
          type: shapeActions.UPDATE_LEFT_ARM_VERTICES,
          payload: currentVertices,
        });
      } else if (bodyPart === "Right Leg") {
        dispatch({
          type: shapeActions.UPDATE_RIGHT_LEG_VERTICES,
          payload: currentVertices,
        });
      } else if (bodyPart === "Left Leg") {
        dispatch({
          type: shapeActions.UPDATE_LEFT_LEG_VERTICES,
          payload: currentVertices,
        });
      }
    }
  };

  const touchStarted = (_p5, event) => {
    // let fs = _p5.fullscreen();
    // if (!fs) {
    //   _p5.fullscreen(true);
    // }
    if (
      _p5.mouseX <= _p5.width &&
      _p5.mouseX >= 0 &&
      _p5.mouseY <= _p5.height &&
      _p5.mouseY >= 0
    ) {
      //   console.log(doneShape, currentLineOrigin, currentVertices);
      if (doneShape) {
        currentLineOrigin = [_p5.mouseX, _p5.mouseY];
        currentVertices.push([_p5.mouseX, _p5.mouseY]);
        allVertices.push([_p5.mouseX, _p5.mouseY]);
        doneShape = false;
      }
    }
  };

  const keyTyped = (p5) => {
    if (p5.key === "o") {
      displayHull = !displayHull;
    } else if (p5.key === "k") {
      k += 10;
      //   console.log(k);
      hullVertices = [];
      hullVertices = hull(allVertices, k);
      //   console.log(hullVertices);
    } else if (p5.key === "j") {
      k -= 10;
      //   console.log(k);
      hullVertices = [];
      hullVertices = hull(allVertices, k);
      //   console.log(hullVertices);
    }
  };

  // function mouseClicked() {
  //   if (doneShape) {
  //     doneShape = false;
  //   }

  //   // lines.push([currentLineOrigin[0], currentLineOrigin[1], p5.mouseX, p5.mouseY]);
  //   // currentLineOrigin = [p5.mouseX, p5.mouseY];
  //   // firstClicked = !firstClicked;
  //   // allVertices.push([p5.mouseX, p5.mouseY]);
  //   // currentVertices.push([p5.mouseX, p5.mouseY]);
  // }

  //   const doubleClicked = (_p5, event) => {
  //     doneShape = true;
  //     currentLineOrigin = [];
  //     shapes.push(currentVertices);

  //     currentVertices = [];
  //   };

  return (
    <Sketch
      setup={setup}
      draw={draw}
      windowResized={windowResized}
      mouseReleased={mouseReleased}
      touchStarted={touchStarted}
      //   doubleClicked={doubleClicked}
      keyTyped={keyTyped}
    />
  );
}
export default P5Sketch;
