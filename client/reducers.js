/**
 * Root Reducer
 */
import { combineReducers } from 'redux';

// Import Reducers
import app from './modules/App/AppReducer';
import forecasts from './modules/Forecast/ForecastReducer';
import users from './modules/User/UserReducer';
import intl from './modules/Intl/IntlReducer';

// Combine all reducers into one root reducer
export default combineReducers({
  app,
  forecasts,
  users,
  intl,
});
