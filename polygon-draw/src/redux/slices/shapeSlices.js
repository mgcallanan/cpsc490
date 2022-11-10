import * as shapeActions from "../actions/shapeActions"

const initialState = {
    headVertices: [],
    torsoVertices: [],
    rightArmVertices: [],
    leftArmVertices: [],
    rightLegVertices: [],
    leftLegVertices: []
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case shapeActions.UPDATE_HEAD_VERTICES: {
      return {
        ...state,
        headVertices: action.payload,
      };
    }
    case shapeActions.UPDATE_TORSO_VERTICES: {
      return {
        ...state,
        torsoVertices: action.payload,
      };
    }
    case shapeActions.UPDATE_RIGHT_ARM_VERTICES: {
      return {
        ...state,
        rightArmVertices: action.payload,
      };
    }
    case shapeActions.UPDATE_LEFT_ARM_VERTICES: {
\      return {
        ...state,
        leftArmVertices: action.payload,
      };
    }
    case shapeActions.UPDATE_RIGHT_LEG_VERTICES: {
      return {
        ...state,
        rightLegVertices: action.payload,
      };
    }
    case shapeActions.UPDATE_LEFT_LEG_VERTICES: {
      return {
        ...state,
        leftLegVertices: action.payload,
      };
    }
    default:
      // If this reducer doesn't recognize the action type, or doesn't
      // care about this specific action, return the existing state unchanged
      return state;
  }
}
