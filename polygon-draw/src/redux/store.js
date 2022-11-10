import { configureStore } from "@reduxjs/toolkit";
import shapeReducer from "./slices/shapeSlices";

const store = configureStore({
  reducer: {
    shapes: shapeReducer,
  },
});

export default store;
