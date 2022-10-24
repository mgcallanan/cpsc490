/// <reference path="../TSDef/p5.global-mode.d.ts" />

let currentLineOrigin = [];
let allVertices = [];
let currentVertices = [];
let hullVertices = [];
let k = 1;
let displayHull = false;
let shapes = [];
let lines = [];
let firstClicked = false;
let secondClicked = false;
let doneShape = true;
let numLines = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  stroke(255, 255, 255);
  strokeWeight(5);

  // Draw current line that hasn't been set yet
  if (mouseIsPressed) {
    line(currentLineOrigin[0], currentLineOrigin[1], mouseX, mouseY);
    noFill();
    strokeWeight(2);
    ellipse(mouseX, mouseY, 20);
  }

  if (displayHull) {
    stroke(0, 0, 255);
    noFill();
    beginShape();
    for (let i = 0; i < hullVertices.length; i++) {
      vertex(hullVertices[i][0], hullVertices[i][1]);
    }
    endShape(CLOSE);
  }

  // Draw shapes that have been drawn
  if (!displayHull) {
    for (let i = 0; i < shapes.length; i++) {
      let currShape = shapes[i];
      noFill();
      stroke(255, 255, 255);
      strokeWeight(5);
      beginShape();
      for (let j = 0; j < currShape.length; j++) {
        vertex(currShape[j][0], currShape[j][1]);
      }
      endShape(CLOSE);
    }

    // Draw lines of the vertex
    for (let i = 0; i < lines.length; i++) {
      stroke(255, 255, 255);
      strokeWeight(5);
      line(lines[i][0], lines[i][1], lines[i][2], lines[i][3]);
    }
  }

  // To get red dots at every vertex
  // for (let i = 0; i < allVertices.length; i++) {
  //   fill(255, 0, 0);
  //   noStroke();
  //   ellipse(allVertices[i][0], allVertices[i][1], 30);
  // }
}

/* full screening will change the size of the canvas */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// function mouseDragged() {
//   console.log("hi");
//   // currentLineOrigin = [mouseX, mouseY];
// }

function mouseReleased() {
  if (currentVertices.length) {
    if (
      Math.abs(mouseX - currentVertices[0][0]) <= 20 &&
      Math.abs(mouseY - currentVertices[0][1]) <= 20
    ) {
      console.log("DONE");
      doneShape = true;
      currentLineOrigin = [];
      currentVertices.push([currentVertices[0][0], currentVertices[0][1]]);
      shapes.push(currentVertices);

      currentVertices = [];
      return;
    }
  }
  lines.push([currentLineOrigin[0], currentLineOrigin[1], mouseX, mouseY]);
  currentLineOrigin = [mouseX, mouseY];
  firstClicked = !firstClicked;
  allVertices.push([mouseX, mouseY]);
  currentVertices.push([mouseX, mouseY]);
  allVertices.push([mouseX, mouseY]);
}

function touchStarted() {
  console.log(doneShape, currentLineOrigin, currentVertices);
  if (doneShape) {
    currentLineOrigin = [mouseX, mouseY];
    currentVertices.push([mouseX, mouseY]);
    allVertices.push([mouseX, mouseY]);
    doneShape = false;
  }
}

// function mouseClicked() {
//   if (doneShape) {
//     doneShape = false;
//   }

//   // lines.push([currentLineOrigin[0], currentLineOrigin[1], mouseX, mouseY]);
//   // currentLineOrigin = [mouseX, mouseY];
//   // firstClicked = !firstClicked;
//   // allVertices.push([mouseX, mouseY]);
//   // currentVertices.push([mouseX, mouseY]);
// }

function calculateConcaveHull(points, k) {
  let hull = concaveHull.calculate(points, k);
  return hull;
}

function keyTyped() {
  if (key === "o") {
    displayHull = !displayHull;
  }
  k++;
  console.log(k);
  hullVertices = [];
  // hullVertices = calculateConcaveHull(allVertices, k);
  hullVertices = hull(allVertices, 20);
  console.log(hullVertices);
}
