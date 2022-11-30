export const updateTodo = (todo) => {
  fetch(`http://localhost:8080/todos/${todo.id}`, {
    body: JSON.stringify(todo),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
  }).then((response) => response.json());
};

export const getProjectors = async () => {
  const response = await fetch(`http://localhost:8080/projectors`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  const data = await response.json();
  return data;
  //   fetch(`http://localhost:8080/projectors`, {
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     method: "GET",
  //   }).then((response) => response.json());
};

export const addProjector = (projector) => {
  fetch(`http://localhost:8080/projectors`, {
    body: JSON.stringify(projector),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  }).then((response) => response.json());
};

export const storeVertices = (projector) => {
  fetch(`http://localhost:8080/projectors/${projector.id}`, {
    body: JSON.stringify(projector),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
  }).then((response) => response.json());
};

// set available projectors
// set active users

export const storeAllVertices = (projector) => {
  fetch(`http://localhost:8080/projectors/`, {
    body: JSON.stringify(projector),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
  }).then((response) => response.json());
};
