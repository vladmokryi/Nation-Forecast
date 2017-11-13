import callApi from '../../util/apiCaller';
import _ from 'lodash';

export const SET_FORECAST = 'SET_FORECAST';
export const SET_PROVIDERS = 'SET_PROVIDERS';
export const UPDATE_PROVIDERS = 'UPDATE_PROVIDERS';

export function setForecast(forecast) {
  return {
    type: SET_FORECAST,
    forecast,
  };
}

export function setProviders(providers) {
  return {
    type: SET_PROVIDERS,
    providers,
  };
}

export function updateProviders(providers) {
  return {
    type: UPDATE_PROVIDERS,
    providers,
  };
}

export function fetchForecast(data) {
  return (dispatch) => {
    return callApi(`forecast?lat=${data.lat}&lon=${data.lon}&period=${data.period}`).then(res => {
      dispatch(setForecast(res.forecast));
      dispatch(updateProviders(res.providers));
    }).catch(err=> console.log(err));
  };
}

export function fetchProviders() {
  return (dispatch) => {
    return callApi('providers').then(res => {
      dispatch(setProviders(_.map(res.providers, (provider) => {
        return {provider}
      })));
    });
  };
}
