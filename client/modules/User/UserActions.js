import callApi from '../../util/apiCaller';
export const UPDATE_RATING = 'UPDATE_RATING';
export const SET_RATINGS = 'SET_RATINGS';
export const SET_USER = 'SET_USER';
import {setRatingToProvider} from '../Forecast/ForecastActions';

export function signUpRequest(user, callback) {
  return (dispatch) => {
    return callApi('users/sign-up', 'post', { user }).then(res => {
      localStorage.setItem('authentication_token', res.token);
      dispatch(getRatings());
      dispatch(fetchUser());
      callback();
    }).catch((err) => {
      callback(err);
    });
  };
}

export function signInRequest(creds, callback) {
  return (dispatch) => {
    return callApi('auth', 'post', creds).then(res => {
      localStorage.setItem('authentication_token', res.token);
      dispatch(getRatings());
      dispatch(fetchUser());
      callback();
    }).catch((err)=> {
      callback(err);
    });
  };
}

export function sendContactForm(data, callback) {
  return (dispatch) => {
    return callApi('user/contact', 'post', data).then(res => {
      callback();
    }).catch((err)=> {
      callback(err);
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
      dispatch(updateRating(res.rating));
      dispatch(setRatingToProvider(res.providerId, res.count));
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

export function setUser(user) {
  return {
    type: SET_USER,
    user,
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

export function fetchUser() {
  return (dispatch) => {
    return callApi('user').then(res => {
      dispatch(setUser(res.user));
    });
  };
}

export function addFavoriteLocation(favorite) {
  return (dispatch) => {
    return callApi('user/favorite', 'post', {favorite}).then(res => {
      dispatch(fetchUser());
    });
  };
}
