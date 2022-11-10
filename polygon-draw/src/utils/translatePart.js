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

const placePolygon = (headVertices, headInfo, targetX, targetY) => {
  let translatedVertices = [];

  //   console.log(targetX, targetY, headInfo.centerX, headInfo.centerY);

  let diffX = targetX - headInfo.centerX;
  let diffY = targetY - headInfo.centerY;

  for (let i = 0; i < headVertices.length; i++) {
    let newX = headVertices[i][0] + diffX;
    let newY = headVertices[i][1] + diffY;

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

export { calculateBBox, getPolygonInfo, scalePolygon, placePolygon };
