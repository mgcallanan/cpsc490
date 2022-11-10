import { configureStore, compose } from "@reduxjs/toolkit";
import shapeReducer from "./slices/shapeSlices";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = configureStore({
  reducer: {
    shapes: shapeReducer,
  },
  composeEnhancers,
});

export default store;
