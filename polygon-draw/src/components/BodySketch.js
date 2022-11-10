import React from "react";
import { connect } from "react-redux";
import Sketch from "react-p5/";
import hull from "hull.js";
import "../styles/bodySketch.scss";
import * as shapeActions from "../redux/actions/shapeActions";

function BodySketch(props) {
  const {
    headVertices,
    torsoVertices,
    rightArmVertices,
    leftArmVertices,
    rightLegVertices,
    leftLegVertices,
  } = props;

  console.log(headVertices);
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth * 0.8, p5.windowHeight * 0.75).parent(
      canvasParentRef
    );
  };

  const draw = (p5) => {
    p5.background(0);
    p5.stroke(255, 255, 255);
    // p5.fill(255, 0, 0);
    p5.strokeWeight(5);

    //draw head
    p5.scale(0.5);
    p5.beginShape();
    for (let i = 0; i < headVertices.length; i++) {
      p5.vertex(headVertices[i][0], headVertices[i][1]);
    }
    p5.endShape(p5.CLOSE);
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
  };
};
export default connect(mapStateToProps)(BodySketch);
