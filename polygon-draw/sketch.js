/// <reference path="../TSDef/p5.global-mode.d.ts" />

let currentLineOrigin = [];
let allVertices = [];
let currentVertices = [];
let lines = [];
let firstClicked = false;
let secondClicked = false;
let doneShape = false;
let numLines = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  stroke(255, 255, 255);

  if (!doneShape) {
    line(currentLineOrigin[0], currentLineOrigin[1], mouseX, mouseY);
  }

  for (let i = 0; i < lines.length; i++) {
    // console.log(lines[i]);
    line(lines[i][0], lines[i][1], lines[i][2], lines[i][3]);
  }
}

/* full screening will change the size of the canvas */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
  if (doneShape) {
    doneShape = false;
  }
  console.log(firstClicked);
  lines.push([currentLineOrigin[0], currentLineOrigin[1], mouseX, mouseY]);
  currentLineOrigin = [mouseX, mouseY];
  firstClicked = !firstClicked;
  allVertices.push([mouseX, mouseY]);
  currentVertices.push([mouseX, mouseY]);
  // if (!firstClicked) {
  //   vertices.push([mouseX, mouseY]);
  //   firstClicked = true;
  // } else {
  //   lines.push([currentLineOrigin[0], currentLineOrigin[1], mouseX, mouseY]);
  //   firstClicked = false;
  //   currentLineOrigin = [mouseX, mouseY];
  //   numLines++;
  // }
}

function doubleClicked() {
  doneShape = true;
  currentLineOrigin = [];
  fill(255, 255, 255);
  beginShape();
  for (let i = 0; i < currentVertices.length; i++) {
    vertex(currentVertices[0], currentVertices[1]);
  }
  vertex(currentVertices[0][0], currentVertices[0][1]);
  endShape();

  currentVertices = [];
}
