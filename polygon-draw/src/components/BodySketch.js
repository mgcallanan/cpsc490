import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import Sketch from "react-p5/";
import * as shapeActions from "../redux/actions/shapeActions";
import {
  calculateBBox,
  getPolygonInfo,
  scalePolygon,
  placePolygon,
  addEyes,
} from "../utils/translatePart";
import { storeVertices } from "../services/dataStore";
import { generateMoreVertices } from "../utils/vertices";

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
    connectedToProjectorID,
  } = props;

  const dispatch = useDispatch();

  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [allVertices, setAllVertices] = useState([]);
  const [transformedHeadVerts, setTransformedHeadVerts] = useState([]);
  const [leftEye, setLeftEye] = useState({});
  const [rightEye, setRightEye] = useState({});
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
    if (transformedHeadVerts.length) {
      if (!Object.keys(leftEye).length || !Object.keys(rightEye).length) {
        const eyes = addEyes(transformedHeadVerts);
        setRightEye(eyes.rightEye);
        setLeftEye(eyes.leftEye);
      }
      const moreHeadVerts = generateMoreVertices(transformedHeadVerts);
      setAllVertices((prevState) => prevState.concat(moreHeadVerts));
    } else {
      setAllVertices((prevState) => prevState.concat(transformedHeadVerts));
    }
  }, [transformedHeadVerts]);

  useEffect(() => {
    if (transformedTorsoVerts.length) {
      const moreTorsoVerts = generateMoreVertices(transformedTorsoVerts);

      setAllVertices((prevState) => prevState.concat(moreTorsoVerts));
    } else {
      setAllVertices((prevState) => prevState.concat(transformedTorsoVerts));
    }
  }, [transformedTorsoVerts]);
  useEffect(() => {
    if (transformedRightArmVerts.length) {
      const moreRightArmVertices = generateMoreVertices(
        transformedRightArmVerts
      );

      setAllVertices((prevState) => prevState.concat(moreRightArmVertices));
    } else {
      setAllVertices((prevState) => prevState.concat(transformedRightArmVerts));
    }
  }, [transformedRightArmVerts]);
  useEffect(() => {
    if (transformedLeftArmVerts.length) {
      const moreLeftArmVerts = generateMoreVertices(transformedLeftArmVerts);

      setAllVertices((prevState) => prevState.concat(moreLeftArmVerts));
    } else {
      setAllVertices((prevState) => prevState.concat(transformedLeftArmVerts));
    }
  }, [transformedLeftArmVerts]);
  useEffect(() => {
    if (transformedRightLegVerts.length) {
      const moreRightLegVertices = generateMoreVertices(
        transformedRightLegVerts
      );

      setAllVertices((prevState) => prevState.concat(moreRightLegVertices));
    } else {
      setAllVertices((prevState) => prevState.concat(transformedRightLegVerts));
    }
  }, [transformedRightLegVerts]);
  useEffect(() => {
    if (transformedLeftLegVerts.length) {
      const moreLeftLegVerts = generateMoreVertices(transformedLeftLegVerts);

      setAllVertices((prevState) => prevState.concat(moreLeftLegVerts));
    } else {
      setAllVertices((prevState) => prevState.concat(transformedLeftLegVerts));
    }
  }, [transformedLeftLegVerts]);

  useEffect(() => {
    dispatch({
      type: shapeActions.UPDATE_ALL_VERTICES,
      payload: allVertices,
    });
    storeVertices({
      id: connectedToProjectorID,
      allVertices,
      rightEye: rightEye,
      leftEye: leftEye,
    }).then((response) => console.log(response));
  }, [allVertices]);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth * 0.8, p5.windowHeight * 0.65).parent(
      canvasParentRef
    );

    setCanvasHeight(p5.height);
    setCanvasWidth(p5.width);
  };

  const draw = (p5) => {
    p5.background("rgba(0,0,0,0)");
    if (!bodyComplete || props.displayHull) {
      p5.stroke(255, 255, 255);
      p5.noFill();
      p5.strokeWeight(5);

      p5.beginShape();
      for (let i = 0; i < transformedHeadVerts.length; i++) {
        p5.vertex(transformedHeadVerts[i][0], transformedHeadVerts[i][1]);
      }
      p5.endShape(p5.CLOSE);

      //draw torso
      p5.stroke(255, 255, 255);
      p5.strokeWeight(5);

      p5.beginShape();
      for (let i = 0; i < transformedTorsoVerts.length; i++) {
        p5.vertex(transformedTorsoVerts[i][0], transformedTorsoVerts[i][1]);
      }
      p5.endShape(p5.CLOSE);

      //draw rightArm
      p5.stroke(255, 255, 255);
      p5.strokeWeight(5);
      p5.beginShape();
      for (let i = 0; i < transformedRightArmVerts.length; i++) {
        p5.vertex(
          transformedRightArmVerts[i][0],
          transformedRightArmVerts[i][1]
        );
      }
      p5.endShape(p5.CLOSE);

      //draw leftArm
      p5.stroke(255, 255, 255);
      p5.strokeWeight(5);
      p5.beginShape();
      for (let i = 0; i < transformedLeftArmVerts.length; i++) {
        p5.vertex(transformedLeftArmVerts[i][0], transformedLeftArmVerts[i][1]);
      }
      p5.endShape(p5.CLOSE);

      //draw rightLeg
      p5.stroke(255, 255, 255);
      p5.strokeWeight(5);
      p5.beginShape();
      for (let i = 0; i < transformedRightLegVerts.length; i++) {
        p5.vertex(
          transformedRightLegVerts[i][0],
          transformedRightLegVerts[i][1]
        );
      }
      p5.endShape(p5.CLOSE);

      //draw leftLeg
      p5.stroke(255, 255, 255);
      p5.strokeWeight(5);
      p5.beginShape();
      for (let i = 0; i < transformedLeftLegVerts.length; i++) {
        p5.vertex(transformedLeftLegVerts[i][0], transformedLeftLegVerts[i][1]);
      }
      p5.endShape(p5.CLOSE);
    }
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
export default connect(mapStateToProps)(BodySketch);
