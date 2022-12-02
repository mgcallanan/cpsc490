import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isArtist: false,
  isProjector: false,
  userType: "",
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUserType(state, action) {
      return {
        ...state,
        userType: action.payload,
      };
    },
    setIsArtist(state, action) {
      return {
        ...state,
        isArtist: action.payload,
      };
    },
    setIsProjector(state, action) {
      return {
        ...state,
        isProjector: action.payload,
      };
    },
    setProjectorID(state, action) {
      return {
        ...state,
        projectorID: action.payload,
      };
    },
    setConnectedToProjectorID(state, action) {
      return {
        ...state,
        connectedToProjectorID: action.payload,
      };
    },
  },
});

export const {
  setIsArtist,
  setIsProjector,
  setUserType,
  setProjectorID,
  setConnectedToProjectorID,
} = userSlice.actions;

export default userSlice.reducer;
