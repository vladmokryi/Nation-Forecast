import { SET_FORECAST, SET_PROVIDERS, UPDATE_PROVIDERS, UPDATE_PROVIDER_RATING } from './ForecastActions';
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

    case UPDATE_PROVIDER_RATING:
      let providersArr = [...state.providers];
      let provider = _.find(providersArr, function (item) {
        return item.provider._id === action.id;
      });
      if (provider) {
        provider.provider.rating = action.count;
        return {
          ...state,
          providers: providersArr
        };
      } else {
        return {
          ...state
        }
      }

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
