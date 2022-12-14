import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  headVertices: [],
  torsoVertices: [],
  rightArmVertices: [],
  leftArmVertices: [],
  rightLegVertices: [],
  leftLegVertices: [],
  allVertices: [],
  headComplete: false,
  torsoComplete: false,
  rightArmComplete: false,
  leftArmComplete: false,
  rightLegComplete: false,
  leftLegComplete: false,
  bodyComplete: false,
};

const shapesSlice = createSlice({
  name: "shapes",
  initialState,
  reducers: {
    updateHeadVertices(state, action) {
      return {
        ...state,
        headVertices: action.payload,
      };
    },
    updateTorsoVertices(state, action) {
      return {
        ...state,
        torsoVertices: action.payload,
      };
    },
    updateRightArmVertices(state, action) {
      return {
        ...state,
        rightArmVertices: action.payload,
      };
    },
    updateLeftArmVertices(state, action) {
      return {
        ...state,
        leftArmVertices: action.payload,
      };
    },
    updateRightLegVertices(state, action) {
      return {
        ...state,
        rightLegVertices: action.payload,
      };
    },
    updateLeftLegVertices(state, action) {
      return {
        ...state,
        leftLegVertices: action.payload,
      };
    },
    updateAllVertices(state, action) {
      return {
        ...state,
        allVertices: action.payload,
      };
    },
    setHeadComplete(state, action) {
      return {
        ...state,
        headComplete: action.payload,
      };
    },
    setTorsoComplete(state, action) {
      return {
        ...state,
        torsoComplete: action.payload,
      };
    },
    setRightArmComplete(state, action) {
      return {
        ...state,
        rightArmComplete: action.payload,
      };
    },
    setLeftArmComplete(state, action) {
      return {
        ...state,
        leftArmComplete: action.payload,
      };
    },
    setRightLegComplete(state, action) {
      return {
        ...state,
        rightLegComplete: action.payload,
      };
    },
    setLeftLegComplete(state, action) {
      return {
        ...state,
        leftLegComplete: action.payload,
      };
    },
    setBodyComplete(state, action) {
      return {
        ...state,
        bodyComplete: action.payload,
      };
    },
  },
});

export const {
  updateHeadVertices,
  updateLeftArmVertices,
  updateRightArmVertices,
  updateLeftLegVertices,
  updateRightLegVertices,
  setHeadComplete,
  setRightArmComplete,
  setLeftArmComplete,
  setRightLegComplete,
  setLeftLegComplete,
  setBodyComplete,
  updateAllVertices,
} = shapesSlice.actions;

export default shapesSlice.reducer;
