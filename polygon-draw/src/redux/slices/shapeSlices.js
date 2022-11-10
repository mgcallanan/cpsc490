// import * as shapeActions from "../actions/shapeActions"
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  headVertices: [],
  torsoVertices: [],
  rightArmVertices: [],
  leftArmVertices: [],
  rightLegVertices: [],
  leftLegVertices: [],
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
  },
});

export const {
  updateHeadVertices,
  updateLeftArmVertices,
  updateRightArmVertices,
  updateLeftLegVertices,
  updateRightLegVertices,
} = shapesSlice.actions;

export default shapesSlice.reducer;
