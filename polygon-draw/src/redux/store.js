import { configureStore, compose } from "@reduxjs/toolkit";
import shapeReducer from "./slices/shapeSlices";
import userReducer from "./slices/userSlices";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = configureStore({
  reducer: {
    shapes: shapeReducer,
    users: userReducer,
  },
  composeEnhancers,
});

export default store;
