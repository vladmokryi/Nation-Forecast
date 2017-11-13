import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {fetchForecast, fetchProviders, setForecast} from '../../ForecastActions';
import {getForecast, getProviders} from '../../ForecastReducer';
import {getAllRatings, getUser} from '../../../User/UserReducer';
import {setRating, getRatings, fetchUser, addFavoriteLocation} from '../../../User/UserActions';
import ForecastSearchInput from '../../components/ForecastSearchInput/ForecastSearchInput';
import ForecastProviders from '../../components/ForecastProviders/ForecastProviders';
import ForecastLocationMap from '../../components/ForecastLocationMap/ForecastLocationMap';
import ForecastCurrent from '../../components/ForecastCurrent/ForecastCurrent';
import FavoriteLocations from '../../../User/components/FavoriteLocations/FavoriteLocations';
import {geocodeByAddress} from 'react-places-autocomplete'
import styles from './ForecastGetPage.css';
import {isLoggedIn} from '../../../../util/apiCaller';
import _ from 'lodash';
import {FormattedDate, FormattedMessage, intlShape, injectIntl} from 'react-intl'
import { BarLoader as Spinner } from 'react-spinners';
import Loading from 'react-loading-spinner';

class ForecastGetPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '', marker: {}, addressChanged: true, forecastPeriod: 7
    };
  }

  onChangeInput = (address) => {
    this.setState({address, addressChanged: true});
  };

  onChangePeriod = (period) => {
    this.setState({forecastPeriod: period});
    if (this.props.forecast && this.props.forecast.location) {
      this.props.dispatch(setForecast({}));
      this.props.dispatch(fetchForecast({lat: this.props.forecast.location.coordinates[1], lon: this.props.forecast.location.coordinates[0], period: period}));
    }
  };

  onSelectInput = (address) => {
    this.setState({address}, this.handleFormSubmit.bind(this));
  };

  componentDidMount() {
    this.props.dispatch(fetchProviders());
    if (this.props.isLoggedIn) {
      this.props.dispatch(getRatings());
      this.props.dispatch(fetchUser());
    }
  }

  handleFormSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    const {address} = this.state;

    if (address) {
      geocodeByAddress(address, (err, {lat, lng}) => {
        if (err) {
          console.log('Oh no!', err)
        } else {
          let marker = this.state.marker;
          marker.position = {lat, lng};
          this.setState({marker: marker, addressChanged: false});
          this.props.dispatch(setForecast({}));
          this.props.dispatch(fetchForecast({lat, lon: lng, period: this.state.forecastPeriod}));
        }
      });
    } else {
      this.setState({marker: {}});
    }
  };

  onClickSetRate = (id) => {
    this.props.dispatch(setRating(id, this.handleFormSubmit.bind(this)));
  };

  selectFavorite = (favorite) => {
    let marker = this.state.marker;
    marker.position = {lat: favorite.location.coordinates[1], lng: favorite.location.coordinates[0]};
    this.setState({address: favorite.name, marker: marker, addressChanged: false});
    this.props.dispatch(setForecast({}));
    this.props.dispatch(fetchForecast({lat: marker.position.lat, lon: marker.position.lng, period: this.state.forecastPeriod}));
  };

  addFavorite = () => {
    if (this.props.forecast) {
      let favorite = {
        name: this.props.forecast.city.name,
        location: this.props.forecast.location
      };
      this.props.dispatch(addFavoriteLocation(favorite));
    }
  };

  isFavorite = () => {
    let self = this;
    if (self.props.forecast && self.props.user && self.props.forecast.location && self.props.user.favoriteLocations) {
      return _.findIndex(self.props.user.favoriteLocations, function (item) {
        if (item.location) {
          return item.location.coordinates[0] === self.props.forecast.location.coordinates[0] && item.location.coordinates[1] === self.props.forecast.location.coordinates[1];
        } else {
          return false;
        }
      }) !== -1;
    } else {
      return false;
    }
  };

  render() {
    return (
      <div>
        <ForecastSearchInput onSubmit={this.handleFormSubmit.bind(this)}
                             address={this.state.address} onChange={this.onChangeInput.bind(this)}
                             onSelect={this.onSelectInput.bind(this)} addFavorite={this.addFavorite.bind(this)} showStar={this.props.isLoggedIn && this.props.forecast.location && !this.state.addressChanged} isFavorite={this.isFavorite()}/>
        { this.props.user && <FavoriteLocations user={this.props.user} onClick={this.selectFavorite.bind(this)} />}
        <div className={styles["forecast-period"]}>
          <a className={this.state.forecastPeriod === 1 ? styles["forecast-period-active"] : ""} onClick={function() { this.onChangePeriod(1); }.bind(this)}><FormattedMessage id="period_1"/></a>
          <a className={this.state.forecastPeriod === 3 ? styles["forecast-period-active"] : ""} onClick={function() { this.onChangePeriod(3); }.bind(this)}><FormattedMessage id="period_3"/></a>
          <a className={this.state.forecastPeriod === 5 ? styles["forecast-period-active"] : ""} onClick={function() { this.onChangePeriod(5); }.bind(this)}><FormattedMessage id="period_5"/></a>
          <a className={this.state.forecastPeriod === 7 ? styles["forecast-period-active"] : ""} onClick={function() { this.onChangePeriod(7); }.bind(this)}><FormattedMessage id="period_7"/></a>
        </div>
        {(this.props.forecast.list && !!this.props.forecast.list.length) && <div className={styles["forecast-container"]}>
          <ForecastLocationMap marker={this.state.marker}/>
          <ForecastCurrent intl={this.props.intl} forecast={this.props.forecast}/>
        </div>}
        {!!this.props.providers.length && <ForecastProviders intl={this.props.intl} providers={this.props.providers} forecast={this.props.forecast} ratings={this.props.ratings}
                           onClick={this.onClickSetRate.bind(this)} isLoggedIn={this.props.isLoggedIn}/>}
      </div>
    );
  }
}

ForecastGetPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intlObj: PropTypes.object.isRequired,
  intl: intlShape.isRequired
};

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    forecast: getForecast(store),
    providers: getProviders(store),
    ratings: getAllRatings(store),
    isLoggedIn: isLoggedIn(),
    user: getUser(store),
    intlObj: store.intl
  };
}

export default injectIntl(connect(mapStateToProps)(ForecastGetPage));

