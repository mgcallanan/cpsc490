import { SERVER_IP_ADDR } from "../utils/ipAddr";

export const updateTodo = (todo) => {
  fetch(`http://${SERVER_IP_ADDR}:8080/todos/${todo.id}`, {
    body: JSON.stringify(todo),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
  }).then((response) => response.json());
};

export const getProjectors = async () => {
  const response = await fetch(`http://${SERVER_IP_ADDR}:8080/projectors`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  const data = await response.json();
  return data;
};

export const addProjector = (projector) => {
  fetch(`http://${SERVER_IP_ADDR}:8080/projectors`, {
    body: JSON.stringify(projector),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  }).then((response) => response.json());
};

export const storeVertices = async (projector) => {
  const response = await fetch(
    `http://${SERVER_IP_ADDR}:8080/projectors/${projector.id}`,
    {
      body: JSON.stringify(projector),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
    }
  );
  const data = await response.json();
  return data;
};

// set available projectors
// set active users

export const storeAllVertices = (projector) => {
  fetch(`http://${SERVER_IP_ADDR}:8080/projectors/`, {
    body: JSON.stringify(projector),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
  }).then((response) => response.json());
};

export const getVertices = async (projectorID) => {
  const response = await fetch(
    `http://${SERVER_IP_ADDR}:8080/projectors/${projectorID}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  );
  const data = await response.json();
  return data;
};
