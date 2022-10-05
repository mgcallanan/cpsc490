/// <reference path="../TSDef/p5.global-mode.d.ts" />

let lines = [];
let firstClicked = false;
let secondClicked = false;
let numLines = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  for (i = 0; i < lines.length; i++) {
    line(lines[i][0], lines[i][1], lines[i][2], lines[i][3]);
  }
}

/* full screening will change the size of the canvas */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
  if (!firstClicked && !secondClicked) {
    firstClicked = true;
    lines.append([mouseX, mouseY]);
  } else if (firstClicked && !secondClicked) {
    secondClicked = true;
    numLines++;
  }
}
