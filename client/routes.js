/* eslint-disable global-require */
import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import App from './modules/App/App';

// require.ensure polyfill for node
if (typeof require.ensure !== 'function') {
  require.ensure = function requireModule(deps, callback) {
    callback(require);
  };
}

/* Workaround for async react routes to work with react-hot-reloader till
  https://github.com/reactjs/react-router/issues/2182 and
  https://github.com/gaearon/react-hot-loader/issues/288 is fixed.
 */
if (process.env.NODE_ENV !== 'production') {
  // Require async routes only in development for react-hot-reloader to work.
  require('./modules/Forecast/pages/ForecastGetPage/ForecastGetPage');
  require('./modules/Forecast/components/ForecastCurrent/ForecastCurrent');
  require('./modules/Forecast/components/ForecastLocationMap/ForecastLocationMap');
  require('./modules/Forecast/components/ForecastProviders/ForecastProviders');
  require('./modules/Forecast/components/ForecastSearchInput/ForecastSearchInput');
  require('./modules/User/components/SignUpWidget/SignUpWidget');
  require('./modules/User/components/SignInWidget/SignInWidget');
}

// react-router setup with code-splitting
// More info: http://blog.mxstbr.com/2016/01/react-apps-with-pages/
export default (
  <Route path="/" component={App}>
    <IndexRoute
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Forecast/pages/ForecastGetPage/ForecastGetPage').default);
        });
      }}
    />
  </Route>
);
