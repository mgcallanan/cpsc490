const addVertices = (v1, v2) => {
  const leftMostV = v1[0] < v2[0] ? v1 : v2;
  const rightMostV = v1[0] < v2[0] ? v2 : v1;
  const numVertices = 10;

  let increment_x = (rightMostV[0] - leftMostV[0]) / (numVertices + 1);
  let increment_y = (rightMostV[1] - leftMostV[1]) / (numVertices + 1);

  let y = leftMostV[1];

  let vertices = [];

  for (let x = leftMostV[0]; x <= rightMostV[0]; x += increment_x) {
    if (
      y <= Math.max(rightMostV[1], leftMostV[1]) &&
      y >= Math.min(rightMostV[1], leftMostV[1])
    ) {
      vertices.push([x, y]);
    }
    y += increment_y;
  }

  return vertices;
};

const generateMoreVertices = (vertices) => {
  if (vertices.length) {
    const finalVertices = [];
    for (let i = 0; i < vertices.length - 1; i++) {
      let newVertices = addVertices(vertices[i], vertices[i + 1]);
      finalVertices.push(...newVertices);
    }

    let newVertices = addVertices(vertices[vertices.length - 1], vertices[0]);
    finalVertices.push(...newVertices);
    return finalVertices;
  }
};

export { addVertices, generateMoreVertices };
