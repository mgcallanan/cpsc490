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
import { setVertices, storeVertices } from "../services/dataStore";

const SCALE_FACTOR = 0.5;
const HEAD_SCALE_FACTOR = 0.7;
const TORSO_SCALE_FACTOR = 0.8;
const ARM_SCALE_FACTOR = 0.5;
const LEG_SCALE_FACTOR = 0.6;

function BodySketch(props) {
  const {
    headVertices,
    torsoVertices,
    rightArmVertices,
    leftArmVertices,
    rightLegVertices,
    leftLegVertices,
    headComplete,
    torsoComplete,
    rightArmComplete,
    leftArmComplete,
    rightLegComplete,
    leftLegComplete,
    bodyComplete,
    projectorID,
  } = props;

  const dispatch = useDispatch();

  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [allVertices, setAllVertices] = useState([]);
  const [transformedHeadVerts, setTransformedHeadVerts] = useState([]);
  const [transformedTorsoVerts, setTransformedTorsoVerts] = useState([]);
  const [transformedRightArmVerts, setTransformedRightArmVerts] = useState([]);
  const [transformedLeftArmVerts, setTransformedLeftArmVerts] = useState([]);
  const [transformedRightLegVerts, setTransformedRightLegVerts] = useState([]);
  const [transformedLeftLegVerts, setTransformedLeftLegVerts] = useState([]);

  let headBBoxVals = {};
  let torsoBBoxVals = {};
  let rightArmBBoxVals = {};
  let leftArmBBoxVals = {};
  let rightLegBBoxVals = {};
  let leftLegBBoxVals = {};

  //   let transformedHeadVerts = [];
  //   let transformedTorsoVerts = [];
  //   let transformedRightArmVerts = [];
  //   let transformedLeftArmVerts = [];
  //   let transformedRightLegVerts = [];
  //   let transformedLeftLegVerts = [];

  if (headComplete) {
    headBBoxVals = calculateBBox(headVertices);
    let scaledHeadInfo = scalePolygon(
      headVertices,
      headBBoxVals,
      HEAD_SCALE_FACTOR
    );
    if (!transformedHeadVerts.length) {
      setTransformedHeadVerts(
        placePolygon(
          scaledHeadInfo.vertices,
          scaledHeadInfo.bBoxVals,
          canvasWidth / 2,
          canvasHeight / 4
        )
      );
      // setAllVertices((prevState) => [...prevState, ...transformedHeadVerts]);
    }
  }
  if (torsoComplete) {
    torsoBBoxVals = calculateBBox(torsoVertices);
    let scaledTorsoInfo = scalePolygon(
      torsoVertices,
      torsoBBoxVals,
      TORSO_SCALE_FACTOR
    );

    let transformedHeadInfo = getPolygonInfo(
      calculateBBox(transformedHeadVerts)
    );
    if (!transformedTorsoVerts.length) {
      setTransformedTorsoVerts(
        placePolygon(
          scaledTorsoInfo.vertices,
          scaledTorsoInfo.bBoxVals,
          canvasWidth / 2,
          transformedHeadInfo.centerY +
            transformedHeadInfo.yRadius * 0.8 +
            scaledTorsoInfo.bBoxVals.yRadius
        )
      );
      // setAllVertices((prevState) => [...prevState, ...transformedTorsoVerts]);
    }
  }

  if (rightArmComplete) {
    let transformedTorsoInfo = getPolygonInfo(
      calculateBBox(transformedTorsoVerts)
    );
    rightArmBBoxVals = calculateBBox(rightArmVertices);

    let scaledRightArmInfo = scalePolygon(
      rightArmVertices,
      rightArmBBoxVals,
      ARM_SCALE_FACTOR
    );

    if (!transformedRightArmVerts.length) {
      setTransformedRightArmVerts(
        placePolygon(
          scaledRightArmInfo.vertices,
          scaledRightArmInfo.bBoxVals,
          transformedTorsoInfo.centerX + (transformedTorsoInfo.xRadius + 0.8),
          transformedTorsoInfo.topLeftY + transformedTorsoInfo.yRadius * 0.4
        )
      );

      // setAllVertices((prevState) => [
      //   ...prevState,
      //   ...transformedRightArmVerts,
      // ]);
    }
  }
  if (leftArmComplete) {
    let transformedTorsoInfo = getPolygonInfo(
      calculateBBox(transformedTorsoVerts)
    );
    leftArmBBoxVals = calculateBBox(leftArmVertices);

    let scaledLeftArmInfo = scalePolygon(
      leftArmVertices,
      leftArmBBoxVals,
      ARM_SCALE_FACTOR
    );

    if (!transformedLeftArmVerts.length) {
      setTransformedLeftArmVerts(
        placePolygon(
          scaledLeftArmInfo.vertices,
          scaledLeftArmInfo.bBoxVals,
          transformedTorsoInfo.centerX - (transformedTorsoInfo.xRadius + 0.8),
          transformedTorsoInfo.topLeftY + transformedTorsoInfo.yRadius * 0.4
        )
      );
      // setAllVertices((prevState) => [...prevState, ...transformedLeftArmVerts]);
    }
  }
  if (rightLegComplete) {
    let transformedTorsoInfo = getPolygonInfo(
      calculateBBox(transformedTorsoVerts)
    );
    rightLegBBoxVals = calculateBBox(rightLegVertices);

    let scaledRightLegInfo = scalePolygon(
      rightLegVertices,
      rightLegBBoxVals,
      LEG_SCALE_FACTOR
    );

    if (!transformedRightLegVerts.length) {
      setTransformedRightLegVerts(
        placePolygon(
          scaledRightLegInfo.vertices,
          scaledRightLegInfo.bBoxVals,
          transformedTorsoInfo.centerX + (transformedTorsoInfo.xRadius + 0.5),
          transformedTorsoInfo.centerY +
            transformedTorsoInfo.yRadius * 0.9 +
            scaledRightLegInfo.bBoxVals.yRadius
        )
      );
      // setAllVertices((prevState) => [
      //   ...prevState,
      //   ...transformedRightLegVerts,
      // ]);
    }
  }
  if (leftLegComplete) {
    let transformedTorsoInfo = getPolygonInfo(
      calculateBBox(transformedTorsoVerts)
    );
    leftLegBBoxVals = calculateBBox(leftLegVertices);

    let scaledLeftLegInfo = scalePolygon(
      leftLegVertices,
      leftLegBBoxVals,
      LEG_SCALE_FACTOR
    );

    if (!transformedLeftLegVerts.length) {
      setTransformedLeftLegVerts(
        placePolygon(
          scaledLeftLegInfo.vertices,
          scaledLeftLegInfo.bBoxVals,
          transformedTorsoInfo.centerX - (transformedTorsoInfo.xRadius + 0.5),
          transformedTorsoInfo.centerY +
            transformedTorsoInfo.yRadius * 0.9 +
            scaledLeftLegInfo.bBoxVals.yRadius
        )
      );
    }
  }

  useEffect(() => {
    setAllVertices((prevState) => prevState.concat(transformedHeadVerts));
  }, [transformedHeadVerts]);

  useEffect(() => {
    setAllVertices((prevState) => prevState.concat(transformedTorsoVerts));
  }, [transformedTorsoVerts]);
  useEffect(() => {
    setAllVertices((prevState) => prevState.concat(transformedRightArmVerts));
  }, [transformedRightArmVerts]);
  useEffect(() => {
    setAllVertices((prevState) => prevState.concat(transformedLeftArmVerts));
  }, [transformedLeftArmVerts]);
  useEffect(() => {
    setAllVertices((prevState) => prevState.concat(transformedRightLegVerts));
  }, [transformedRightLegVerts]);
  useEffect(() => {
    setAllVertices((prevState) => prevState.concat(transformedLeftLegVerts));
  }, [transformedLeftLegVerts]);

  useEffect(() => {
    dispatch({
      type: shapeActions.UPDATE_ALL_VERTICES,
      payload: allVertices,
    });
    console.log(projectorID);
    storeVertices({ id: projectorID, allVertices }).then((response) =>
      console.log(response)
    );
  }, [allVertices]);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth * 0.8, p5.windowHeight * 0.65).parent(
      canvasParentRef
    );

    setCanvasHeight(p5.height);
    setCanvasWidth(p5.width);
  };

  const draw = (p5) => {
    p5.background(0);
    if (!bodyComplete || props.displayHull) {
      p5.stroke(255, 255, 255);
      // p5.fill(255, 0, 0);
      p5.noFill();
      p5.strokeWeight(5);

      // draw head
      // p5.scale(0.5);
      // p5.beginShape();
      // for (let i = 0; i < headVertices.length; i++) {
      //   p5.vertex(headVertices[i][0], headVertices[i][1]);
      // }
      // p5.endShape(p5.CLOSE);

      p5.beginShape();
      for (let i = 0; i < transformedHeadVerts.length; i++) {
        p5.vertex(transformedHeadVerts[i][0], transformedHeadVerts[i][1]);
      }
      p5.endShape(p5.CLOSE);

      // if (headComplete) {
      //   p5.noFill();
      //   p5.stroke(0, 0, 255);
      //   //   console.log("hey");
      //   //   console.log(headBBoxVals);
      //   p5.rect(
      //     headBBoxVals.rx,
      //     headBBoxVals.ry,
      //     headBBoxVals.width,
      //     headBBoxVals.height
      //   );
      //   p5.fill(255);

      //   p5.noFill();
      // }
      // p5.scale(2);

      //draw torso
      p5.stroke(255, 255, 255);
      // p5.fill(255, 0, 0);
      p5.strokeWeight(5);
      // p5.scale(0.5);
      // p5.beginShape();
      // for (let i = 0; i < torsoVertices.length; i++) {
      //   p5.vertex(torsoVertices[i][0], torsoVertices[i][1]);
      // }
      // p5.endShape(p5.CLOSE);

      p5.beginShape();
      for (let i = 0; i < transformedTorsoVerts.length; i++) {
        p5.vertex(transformedTorsoVerts[i][0], transformedTorsoVerts[i][1]);
      }
      p5.endShape(p5.CLOSE);

      // if (torsoComplete) {
      //   p5.noFill();
      //   p5.stroke(0, 0, 255);
      //   //   console.log("hey");
      //   //   console.log(torsoBBoxVals);
      //   p5.rect(
      //     torsoBBoxVals.rx,
      //     torsoBBoxVals.ry,
      //     torsoBBoxVals.width,
      //     torsoBBoxVals.height
      //   );
      // }
      // p5.scale(2);

      //draw rightArm
      p5.stroke(255, 255, 255);
      // p5.fill(255, 0, 0);
      p5.strokeWeight(5);
      // p5.scale(0.5);
      p5.beginShape();
      for (let i = 0; i < transformedRightArmVerts.length; i++) {
        p5.vertex(
          transformedRightArmVerts[i][0],
          transformedRightArmVerts[i][1]
        );
      }
      p5.endShape(p5.CLOSE);
      // p5.scale(2);

      //draw leftArm
      p5.stroke(255, 255, 255);
      // p5.fill(255, 0, 0);
      p5.strokeWeight(5);
      // p5.scale(0.5);
      p5.beginShape();
      for (let i = 0; i < transformedLeftArmVerts.length; i++) {
        p5.vertex(transformedLeftArmVerts[i][0], transformedLeftArmVerts[i][1]);
      }
      p5.endShape(p5.CLOSE);

      // if (leftArmComplete) {
      //   p5.noFill();
      //   p5.stroke(0, 0, 255);
      //   //   console.log("hey");
      //   //   console.log(leftArmBBoxVals);
      //   p5.rect(
      //     leftArmBBoxVals.rx,
      //     leftArmBBoxVals.ry,
      //     leftArmBBoxVals.width,
      //     leftArmBBoxVals.height
      //   );
      // }
      // p5.scale(2);

      //draw rightLeg
      p5.stroke(255, 255, 255);
      // p5.fill(255, 0, 0);
      p5.strokeWeight(5);
      // p5.scale(0.5);
      p5.beginShape();
      for (let i = 0; i < transformedRightLegVerts.length; i++) {
        p5.vertex(
          transformedRightLegVerts[i][0],
          transformedRightLegVerts[i][1]
        );
      }
      p5.endShape(p5.CLOSE);
      // p5.scale(2);

      //draw leftLeg
      p5.stroke(255, 255, 255);
      // p5.fill(255, 0, 0);
      p5.strokeWeight(5);
      // p5.scale(0.5);
      p5.beginShape();
      for (let i = 0; i < transformedLeftLegVerts.length; i++) {
        p5.vertex(transformedLeftLegVerts[i][0], transformedLeftLegVerts[i][1]);
      }
      p5.endShape(p5.CLOSE);
    }

    if (bodyComplete) {
      //   console.log("ALLLLL DONEEEE");
      const hullVertices = hull(allVertices, props.k);
      p5.stroke(0, 0, 255);
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
  };
};
export default connect(mapStateToProps)(BodySketch);
