import {SET_RATINGS, UPDATE_RATING} from './UserActions';
// Initial State
const initialState = { ratings: {} };

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RATINGS:
      return {
        ...state,
        ratings: action.ratings,
      };
    case UPDATE_RATING:
      return {
        ...state,
        ratings: {...state.ratings, ...action.rating}
      };
    default:
      return state;
  }
};

/* Selectors */

// Get products
export const getAllRatings = (state) => {
  return state.users.ratings;
};

// Export Reducer
export default UserReducer;
