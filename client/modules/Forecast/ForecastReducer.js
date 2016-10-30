import { SET_FORECAST, SET_PROVIDERS } from './ForecastActions';

// Initial State
const initialState = { providers: [], forecast: {} };

const ForecastReducer = (state = initialState, action) => {
  switch (action.type) {

    case SET_FORECAST:
      return {
        ...state,
        forecast: action.forecast,
      };

    case SET_PROVIDERS:
      return {
        ...state,
        providers: action.providers,
      };

    default:
      return state;
  }
};

/* Selectors */

// Get products
export const getForecast = (state) => {
  return state.forecasts.forecast;
};

// Get product by cuid
export const getProviders = (state) => {
  return state.forecasts.providers;
};

// Export Reducer
export default ForecastReducer;
