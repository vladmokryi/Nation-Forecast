import callApi from '../../util/apiCaller';
export const UPDATE_RATING = 'UPDATE_RATING';
export const SET_RATINGS = 'SET_RATINGS';
import {fetchProviders} from '../Forecast/ForecastActions';

export function signUpRequest(user, callback) {
  return (dispatch) => {
    return callApi('users/sign-up', 'post', { user }).then(res => {
      localStorage.setItem('authentication_token', res.token);
      dispatch(getRatings());
      callback();
    });
  };
}

export function signInRequest(creds, callback) {
  return (dispatch) => {
    return callApi('auth', 'post', creds).then(res => {
      localStorage.setItem('authentication_token', res.token);
      dispatch(getRatings());
      callback();
    });
  };
}

export function signOut() {
  return (dispatch) => {
    localStorage.removeItem('authentication_token');
    window.location.reload();
  };
}

export function setRating(providerId, callback) {
  return (dispatch) => {
    return callApi('ratings', 'post', {providerId}).then(res => {
      dispatch(updateRating(res));
      dispatch(fetchProviders());
      callback();
    });
  };
}

export function setRatings(ratings) {
  return {
    type: SET_RATINGS,
    ratings,
  };
}

export function updateRating(rating) {
  return {
    type: UPDATE_RATING,
    rating,
  };
}

export function getRatings() {
  return (dispatch) => {
    return callApi('ratings').then(res => {
      dispatch(setRatings(res.ratings));
    });
  };
}
