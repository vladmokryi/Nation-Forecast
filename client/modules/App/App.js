import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import {injectIntl, intlShape, FormattedRelative} from 'react-intl';

// Import Style
import styles from './App.css';

// Import Components
import Helmet from 'react-helmet';
import Header from './components/Header/Header';

// Import Actions
import { switchLanguage } from '../../modules/Intl/IntlActions';
import {isLoggedIn} from '../../util/apiCaller';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isMounted: false };
  }

  componentDidMount() {
    this.setState({isMounted: true}); // eslint-disable-line
  }

  render() {
    return (
      <div>
        <div>
          <Helmet
            title="National Forecast"
            meta={[
              { charset: 'utf-8' },
              {
                'http-equiv': 'X-UA-Compatible',
                content: 'IE=edge',
              },
              {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
              },
              {
                name: 'description',
                content: 'National Forecast - Your Personal Helper!',
              },
              {
                property: 'og:title',
                content: 'National Forecast',
              },
              {
                property: 'og:description',
                content: 'National Forecast - Your Personal Helper!',
              },
              {
                property: 'og: image',
                content: '/img/vectorpaint.png',
              },

            ]}
          />
          <div className={styles.wrapper}>
            <Header
              switchLanguage={lang => this.props.dispatch(switchLanguage(lang))}
              languages={this.props.intlObj.enabledLanguages}
              dispatch={this.props.dispatch}
              isLoggedIn={this.props.isLoggedIn}
            />
            <div className={styles.container}>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  intlObj: PropTypes.object.isRequired
};

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    intlObj: store.intl,
    isLoggedIn: isLoggedIn()
  };
}

export default injectIntl(connect(mapStateToProps)(App));
