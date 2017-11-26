import callApi from '../../util/apiCaller';
import _ from 'lodash';

export const SET_FORECAST = 'SET_FORECAST';
export const SET_PROVIDERS = 'SET_PROVIDERS';
export const UPDATE_PROVIDERS = 'UPDATE_PROVIDERS';
export const UPDATE_PROVIDER_RATING = 'UPDATE_PROVIDER_RATING';

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

export function fetchForecast(data, callback) {
  callback = callback ? callback : () => {};
  return (dispatch) => {
    return callApi(`forecast?lat=${data.lat}&lon=${data.lon}&period=${data.period}`).then(res => {
      dispatch(setForecast(res.forecast));
      dispatch(updateProviders(res.providers));
      callback();
    }).catch(err=> {
      console.log(err);
      callback(err);
    });
  };
}

export function setRatingToProvider(id, count) {
  return {
    type: UPDATE_PROVIDER_RATING,
    id, count
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
