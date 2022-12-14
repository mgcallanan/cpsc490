const calculateBBox = (vertices) => {
  const minX = vertices.reduce((previous, current) => {
    return current[0] < previous[0] ? current : previous;
  });
  const minY = vertices.reduce((previous, current) => {
    return current[1] < previous[1] ? current : previous;
  });

  const maxX = vertices.reduce((previous, current) => {
    return current[0] > previous[0] ? current : previous;
  });
  const maxY = vertices.reduce((previous, current) => {
    return current[1] > previous[1] ? current : previous;
  });

  let w = maxX[0] - minX[0];
  let h = maxY[1] - minY[1];

  return {
    width: w,
    height: h,
    rx: minX[0],
    ry: minY[1],
  };
};

const getPolygonInfo = (bBoxVals) => {
  let centerX = bBoxVals.rx + bBoxVals.width / 2;
  let centerY = bBoxVals.ry + bBoxVals.height / 2;
  let xRadius = bBoxVals.width / 2;

  let yRadius = bBoxVals.height / 2;

  return {
    topLeftX: bBoxVals.rx,
    topLeftY: bBoxVals.ry,
    centerX: centerX,
    centerY: centerY,
    xRadius: xRadius,
    yRadius: yRadius,
  };
};

const placePolygon = (shapeVertices, shapeInfo, targetX, targetY) => {
  let translatedVertices = [];

  let diffX = targetX - shapeInfo.centerX;
  let diffY = targetY - shapeInfo.centerY;

  for (let i = 0; i < shapeVertices.length; i++) {
    let newX = shapeVertices[i][0] + diffX;
    let newY = shapeVertices[i][1] + diffY;

    translatedVertices.push([newX, newY]);
  }

  return translatedVertices;
};

const scalePolygon = (vertices, bBoxVals, scaleFactor) => {
  let polyInfo = getPolygonInfo(bBoxVals);
  let newVerts = [];
  for (let i = 0; i < vertices.length; i++) {
    let newX = (vertices[i][0] - polyInfo.centerX) * scaleFactor;
    let newY = (vertices[i][1] - polyInfo.centerY) * scaleFactor;

    newX += polyInfo.centerX;
    newY += polyInfo.centerY;

    newVerts.push([newX, newY]);
  }

  let newPolyInfo = getPolygonInfo(calculateBBox(newVerts));

  return {
    bBoxVals: newPolyInfo,
    vertices: newVerts,
  };
};

const placeAtBottom = (vertices, height, width) => {
  const bBoxVals = calculateBBox(vertices);
  const polyInfo = getPolygonInfo(bBoxVals);

  const newY = height / 2;
  const newX = width / 2;

  const newVertices = placePolygon(vertices, polyInfo, newX, newY);

  return newVertices;
};

const addEyes = (headVertices) => {
  const bBoxVals = calculateBBox(headVertices);
  const headInfo = getPolygonInfo(bBoxVals);
  const eyeY = headInfo.topLeftY + bBoxVals.height / 3;
  const rightEyeXCenter = headInfo.topLeftX + bBoxVals.width * (2 / 3);
  const leftEyeXCenter = headInfo.topLeftX + bBoxVals.width / 3;

  const eyeWidth = bBoxVals.width / 5;

  const rightEyeRightCorner = [rightEyeXCenter + eyeWidth * 0.5, eyeY];
  const rightEyeLeftCorner = [rightEyeXCenter - eyeWidth * 0.5, eyeY];

  const rightEyeRightCornerIntersectTop = [rightEyeRightCorner[0], 0];
  const rightEyeLeftCornerIntersectTop = [rightEyeLeftCorner[0], 0];

  const leftEyeRightCorner = [leftEyeXCenter + eyeWidth * 0.5, eyeY];
  const leftEyeLeftCorner = [leftEyeXCenter - eyeWidth * 0.5, eyeY];

  const leftEyeRightCornerIntersectTop = [leftEyeRightCorner[0], 0];
  const leftEyeLeftCornerIntersectTop = [leftEyeLeftCorner[0], 0];

  const rightEyeRightCornerIntersect = getEyeCornerIntersection(
    rightEyeRightCorner,
    rightEyeRightCornerIntersectTop,
    headVertices,
    eyeY
  );

  const rightEyeLeftCornerIntersect = getEyeCornerIntersection(
    rightEyeLeftCorner,
    rightEyeLeftCornerIntersectTop,
    headVertices,
    eyeY
  );

  const leftEyeRightCornerIntersect = getEyeCornerIntersection(
    leftEyeRightCorner,
    leftEyeRightCornerIntersectTop,
    headVertices,
    eyeY
  );
  const leftEyeLeftCornerIntersect = getEyeCornerIntersection(
    leftEyeLeftCorner,
    leftEyeLeftCornerIntersectTop,
    headVertices,
    eyeY
  );

  return {
    leftEye: {
      vertices: [
        leftEyeLeftCornerIntersect.intersection,
        leftEyeRightCorner,
        leftEyeLeftCorner,
        leftEyeRightCornerIntersect.intersection,
      ],
      breakingEdge: leftEyeLeftCornerIntersect.breakingEdge,
    },
    rightEye: {
      vertices: [
        rightEyeLeftCornerIntersect.intersection,
        rightEyeRightCorner,
        rightEyeLeftCorner,
        rightEyeRightCornerIntersect.intersection,
      ],
      breakingEdge: rightEyeLeftCornerIntersect.breakingEdge,
    },
  };
};

const getEyeCornerIntersection = (eyeStart, eyeEnd, headVertices, eyeY) => {
  let intersection = [];
  let breakingEdge = [];
  for (let i = 0; i < headVertices.length - 1; i++) {
    const edgeStart = headVertices[i];
    const edgeEnd = headVertices[i + 1];

    intersection = lineLineIntersection(eyeStart, eyeEnd, edgeStart, edgeEnd);

    if (intersection.length) {
      breakingEdge = [edgeStart, edgeEnd];
      break;
    }
  }
  return { intersection: intersection, breakingEdge: breakingEdge };
};

const lineLineIntersection = (eyeStart, eyeEnd, edgeStart, edgeEnd) => {
  // Line AB represented as a1x + b1y = c1
  var a1 = eyeEnd[1] - eyeStart[1];
  var b1 = eyeStart[0] - eyeEnd[0];
  var c1 = a1 * eyeStart[0] + b1 * eyeStart[1];

  // Line CD represented as a2x + b2y = c2
  var a2 = edgeEnd[1] - edgeStart[1];
  var b2 = edgeStart[0] - edgeEnd[0];
  var c2 = a2 * edgeStart[0] + b2 * edgeStart[1];

  var determinant = a1 * b2 - a2 * b1;

  if (determinant === 0) {
    // The lines are parallel. This is simplified
    // by returning a pair of FLT_MAX
    return [];
  } else {
    var x = (b2 * c1 - b1 * c2) / determinant;
    var y = (a1 * c2 - a2 * c1) / determinant;

    // if (
    //   x > edgeEnd[0] ||
    //   x < edgeStart[0] ||
    //   y > edgeStart[1] ||
    //   y < edgeEnd[1]
    // ) {
    //   return [];
    // }
    if (
      x < Math.min(edgeStart[0], edgeEnd[0]) ||
      x > Math.max(edgeStart[0], edgeEnd[0]) ||
      y < Math.min(edgeStart[1], edgeEnd[1]) ||
      y > Math.max(edgeStart[1], edgeEnd[1])
    ) {
      return [];
    }
    return [x, y];
  }
};

const findEyeIntersectionPoint = (allVertices, leftEyeInfo, rightEyeInfo) => {
  let deletingLeftVerts = false;
  let deletingRightVerts = false;

  let doneRightEye = false;
  let doneLeftEye = false;

  let eyeVerts = [];
  for (let i = 0; i < allVertices.length - 1; i++) {
    let curV = allVertices[i];
    let nextV = allVertices[i + 1];

    if (doneLeftEye && doneRightEye) {
      eyeVerts.push(allVertices[i]);
      continue;
    }

    if (deletingLeftVerts) {
      if (
        leftEyeInfo.vertices[3][0] >= Math.min(curV[0], nextV[0]) &&
        leftEyeInfo.vertices[3][0] <= Math.max(curV[0], nextV[0]) &&
        leftEyeInfo.vertices[3][1] >= Math.min(curV[1], nextV[1]) &&
        leftEyeInfo.vertices[3][1] <= Math.max(curV[1], nextV[1])
      ) {
        deletingLeftVerts = false;
        doneLeftEye = true;
      }
    } else {
      if (
        leftEyeInfo.vertices[0][0] >= Math.min(curV[0], nextV[0]) &&
        leftEyeInfo.vertices[0][0] <= Math.max(curV[0], nextV[0]) &&
        leftEyeInfo.vertices[0][1] >= Math.min(curV[1], nextV[1]) &&
        leftEyeInfo.vertices[0][1] <= Math.max(curV[1], nextV[1])
      ) {
        deletingLeftVerts = true;
        eyeVerts.push(...leftEyeInfo.vertices);
      }
    }

    if (deletingRightVerts) {
      if (
        rightEyeInfo.vertices[3][0] >= Math.min(curV[0], nextV[0]) &&
        rightEyeInfo.vertices[3][0] <= Math.max(curV[0], nextV[0]) &&
        rightEyeInfo.vertices[3][1] >= Math.min(curV[1], nextV[1]) &&
        rightEyeInfo.vertices[3][1] <= Math.max(curV[1], nextV[1])
      ) {
        deletingRightVerts = false;
        doneRightEye = true;
      }
    } else {
      if (
        rightEyeInfo.vertices[0][0] >= Math.min(curV[0], nextV[0]) &&
        rightEyeInfo.vertices[0][0] <= Math.max(curV[0], nextV[0]) &&
        rightEyeInfo.vertices[0][1] >= Math.min(curV[1], nextV[1]) &&
        rightEyeInfo.vertices[0][1] <= Math.max(curV[1], nextV[1])
      ) {
        deletingRightVerts = true;
        eyeVerts.push(...rightEyeInfo.vertices);
      }
    }

    if (!deletingLeftVerts && !deletingRightVerts) {
      eyeVerts.push(allVertices[i]);
    }
  }

  return eyeVerts;
};

export {
  calculateBBox,
  getPolygonInfo,
  scalePolygon,
  placePolygon,
  placeAtBottom,
  addEyes,
  findEyeIntersectionPoint,
};
