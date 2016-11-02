import callApi, {callApiForm} from '../../util/apiCaller';
import _ from 'lodash';

export const SET_FORECAST = 'SET_FORECAST';
export const SET_PROVIDERS = 'SET_PROVIDERS';

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

export function fetchForecast(data) {
  return (dispatch) => {
    return callApi(`forecast?lat=${data.lat}&lon=${data.lon}`).then(res => {
      dispatch(setForecast(res.forecast));
      dispatch(setProviders(res.providers));
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

export function clearForecast() {

}

