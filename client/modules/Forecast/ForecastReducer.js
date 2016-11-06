import { SET_FORECAST, SET_PROVIDERS, UPDATE_PROVIDERS } from './ForecastActions';
import _ from 'lodash';
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

    case UPDATE_PROVIDERS:
      let providers = [...state.providers];
      _.forEach(providers, (oldProvider, index) => {
        _.forEach(action.providers, (newProvider) => {
          if(newProvider.provider._id == oldProvider.provider._id) {
            providers[index] = newProvider;
          }
        })
      });
      return {
        ...state,
        providers: providers
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
