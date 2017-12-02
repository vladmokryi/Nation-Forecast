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
import {FormattedMessage, intlShape, injectIntl} from 'react-intl'
import {FaTwitter, FaFacebook, FaGooglePlus} from 'react-icons/lib/fa';

class ForecastGetPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '', marker: {}, addressChanged: true, forecastPeriod: 7, loading: false
    };
  }

  onChangeInput = (address) => {
    this.setState({address, addressChanged: true});
  };

  onChangePeriod = (period) => {
    this.setState({forecastPeriod: period, loading: true});
    if (this.props.forecast && this.props.forecast.location) {
      this.props.dispatch(setForecast({}));
      this.props.dispatch(fetchForecast({
        lat: this.props.forecast.location.coordinates[1],
        lon: this.props.forecast.location.coordinates[0],
        period: period
      }, () => {
        this.setState({loading: false});
      }));
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
    if (this.props.location.query.q) {
      this.onSelectInput(this.props.location.query.q);
    }
  }

  handleFormSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    if (!this.state.loading) {
      this.setState({loading: true}, () => {
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
              this.props.dispatch(fetchForecast({lat, lon: lng, period: this.state.forecastPeriod}, (err) => {
                this.setState({loading: false});
              }));
            }
          });
        } else {
          this.setState({marker: {}, loading: false});
        }
      });
    }
  };

  onClickSetRate = (id) => {
    this.props.dispatch(setRating(id, (res) => {
    }));
  };

  selectFavorite = (favorite) => {
    let marker = this.state.marker;
    marker.position = {lat: favorite.location.coordinates[1], lng: favorite.location.coordinates[0]};
    this.setState({address: favorite.name, marker: marker, addressChanged: false, loading: true});
    this.props.dispatch(setForecast({}));
    this.props.dispatch(fetchForecast({
      lat: marker.position.lat,
      lon: marker.position.lng,
      period: this.state.forecastPeriod
    }, (err) => {
      this.setState({loading: false});
    }));
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

  dynamicShareLink = (type) => {
    const link = encodeURI(typeof window !== 'undefined' ? window.location.origin + (this.state.address ? '?q=' + this.state.address : '') : '');
    switch (type) {
      case 'tw':
        return 'https://twitter.com/share?url=' + link;
      case 'fb':
        return 'https://www.facebook.com/sharer.php?u=' + link;
      case 'gplus':
        return 'https://plus.google.com/share?url=' + link;
      default:
        return '';
    }
  };

  render() {
    return (
      <div>
        <ForecastSearchInput onSubmit={this.handleFormSubmit.bind(this)}
                             address={this.state.address} onChange={this.onChangeInput.bind(this)}
                             onSelect={this.onSelectInput.bind(this)} addFavorite={this.addFavorite.bind(this)}
                             showStar={this.props.isLoggedIn && this.props.forecast.location && !this.state.addressChanged}
                             isFavorite={this.isFavorite()}/>
        { this.props.user && <FavoriteLocations user={this.props.user} onClick={this.selectFavorite.bind(this)}/>}
        <div className={styles["period-share-container"]}>
          <div className={styles["forecast-period"]}>
            <a className={this.state.forecastPeriod === 1 ? styles["forecast-period-active"] : ""}
               onClick={function () {
                 this.onChangePeriod(1);
               }.bind(this)}>
              <span className={styles["full-content"]}>
              <FormattedMessage id="period_1"/>
              </span>
              <span className={styles["short-content"]}>1</span>
            </a>
            <a className={this.state.forecastPeriod === 3 ? styles["forecast-period-active"] : ""}
               onClick={function () {
                 this.onChangePeriod(3);
               }.bind(this)}><span className={styles["full-content"]}><FormattedMessage id="period_3"/></span>
              <span className={styles["short-content"]}>3</span></a>
            <a className={this.state.forecastPeriod === 5 ? styles["forecast-period-active"] : ""}
               onClick={function () {
                 this.onChangePeriod(5);
               }.bind(this)}><span className={styles["full-content"]}><FormattedMessage id="period_5"/></span>
              <span className={styles["short-content"]}>5</span></a>
            <a className={this.state.forecastPeriod === 7 ? styles["forecast-period-active"] : ""}
               onClick={function () {
                 this.onChangePeriod(7);
               }.bind(this)}>
              <span className={styles["full-content"]}><FormattedMessage id="period_7"/></span>
              <span className={styles["short-content"]}>7</span></a>
          </div>
          {(!this.state.loading && this.props.forecast.list && !!this.props.forecast.list.length) &&
          <div className={styles["forecast-share"]}>
            <a href={this.dynamicShareLink('tw')} target="_blank"><FaTwitter/></a>
            <a href={this.dynamicShareLink('fb')} target="_blank"><FaFacebook/></a>
            <a href={this.dynamicShareLink('gplus')} target="_blank"><FaGooglePlus/></a>
          </div>}
        </div>
        {(!this.state.loading && this.props.forecast.list && !!this.props.forecast.list.length) &&
        <div className={styles["forecast-container"]}>
          <ForecastLocationMap marker={this.state.marker}/>
          <ForecastCurrent intl={this.props.intl} forecast={this.props.forecast}/>
        </div>}
        { this.state.loading &&
        <div className={styles["preloader"]}>
          <svg version="1.1" className={styles["sun"]} id="sun" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
               width="10px" height="10px" viewBox="0 0 10 10">
            <g>
              <path fill="none"
                    d="M6.942,3.876c-0.4-0.692-1.146-1.123-1.946-1.123c-0.392,0-0.779,0.104-1.121,0.301c-1.072,0.619-1.44,1.994-0.821,3.067C3.454,6.815,4.2,7.245,5,7.245c0.392,0,0.779-0.104,1.121-0.301C6.64,6.644,7.013,6.159,7.167,5.581C7.321,5,7.243,4.396,6.942,3.876z M6.88,5.505C6.745,6.007,6.423,6.427,5.973,6.688C5.676,6.858,5.34,6.948,5,6.948c-0.695,0-1.343-0.373-1.69-0.975C2.774,5.043,3.093,3.849,4.024,3.312C4.32,3.14,4.656,3.05,4.996,3.05c0.695,0,1.342,0.374,1.69,0.975C6.946,4.476,7.015,5,6.88,5.505z"></path>
              <path fill="none"
                    d="M8.759,2.828C8.718,2.757,8.626,2.732,8.556,2.774L7.345,3.473c-0.07,0.041-0.094,0.132-0.053,0.202C7.319,3.723,7.368,3.75,7.419,3.75c0.025,0,0.053-0.007,0.074-0.02l1.211-0.699C8.774,2.989,8.8,2.899,8.759,2.828z"></path>
              <path fill="none"
                    d="M1.238,7.171c0.027,0.047,0.077,0.074,0.128,0.074c0.025,0,0.051-0.008,0.074-0.02l1.211-0.699c0.071-0.041,0.095-0.133,0.054-0.203S2.574,6.228,2.503,6.269l-1.21,0.699C1.221,7.009,1.197,7.101,1.238,7.171z"></path>
              <path fill="none"
                    d="M6.396,2.726c0.052,0,0.102-0.026,0.13-0.075l0.349-0.605C6.915,1.976,6.89,1.885,6.819,1.844c-0.07-0.042-0.162-0.017-0.202,0.054L6.269,2.503C6.228,2.574,6.251,2.666,6.322,2.706C6.346,2.719,6.371,2.726,6.396,2.726z"></path>
              <path fill="none"
                    d="M3.472,7.347L3.123,7.952c-0.041,0.07-0.017,0.162,0.054,0.203C3.2,8.169,3.226,8.175,3.25,8.175c0.052,0,0.102-0.027,0.129-0.074l0.349-0.605c0.041-0.07,0.017-0.16-0.054-0.203C3.603,7.251,3.513,7.276,3.472,7.347z"></path>
              <path fill="none"
                    d="M3.601,2.726c0.025,0,0.051-0.007,0.074-0.02C3.746,2.666,3.77,2.574,3.729,2.503l-0.35-0.604C3.338,1.828,3.248,1.804,3.177,1.844C3.106,1.886,3.082,1.976,3.123,2.047l0.35,0.604C3.5,2.7,3.549,2.726,3.601,2.726z"></path>
              <path fill="none"
                    d="M6.321,7.292c-0.07,0.043-0.094,0.133-0.054,0.203l0.351,0.605c0.026,0.047,0.076,0.074,0.127,0.074c0.025,0,0.051-0.006,0.074-0.02c0.072-0.041,0.096-0.133,0.055-0.203l-0.35-0.605C6.483,7.276,6.393,7.253,6.321,7.292z"></path>
              <path fill="none"
                    d="M2.202,5.146c0.082,0,0.149-0.065,0.149-0.147S2.284,4.851,2.202,4.851H1.503c-0.082,0-0.148,0.066-0.148,0.148s0.066,0.147,0.148,0.147H2.202z"></path>
              <path fill="none"
                    d="M8.493,4.851H7.794c-0.082,0-0.148,0.066-0.148,0.148s0.066,0.147,0.148,0.147l0,0h0.699c0.082,0,0.148-0.065,0.148-0.147S8.575,4.851,8.493,4.851L8.493,4.851z"></path>
              <path fill="none"
                    d="M5.146,2.203V0.805c0-0.082-0.066-0.148-0.148-0.148c-0.082,0-0.148,0.066-0.148,0.148v1.398c0,0.082,0.066,0.149,0.148,0.149C5.08,2.352,5.146,2.285,5.146,2.203z"></path>
              <path fill="none"
                    d="M4.85,7.796v1.396c0,0.082,0.066,0.15,0.148,0.15c0.082,0,0.148-0.068,0.148-0.15V7.796c0-0.082-0.066-0.148-0.148-0.148C4.917,7.647,4.85,7.714,4.85,7.796z"></path>
              <path fill="none"
                    d="M2.651,3.473L1.44,2.774C1.369,2.732,1.279,2.757,1.238,2.828C1.197,2.899,1.221,2.989,1.292,3.031l1.21,0.699c0.023,0.013,0.049,0.02,0.074,0.02c0.051,0,0.101-0.026,0.129-0.075C2.747,3.604,2.722,3.514,2.651,3.473z"></path>
              <path fill="none"
                    d="M8.704,6.968L7.493,6.269c-0.07-0.041-0.162-0.016-0.201,0.055c-0.041,0.07-0.018,0.162,0.053,0.203l1.211,0.699c0.023,0.012,0.049,0.02,0.074,0.02c0.051,0,0.102-0.027,0.129-0.074C8.8,7.101,8.776,7.009,8.704,6.968z"></path>
            </g>
          </svg>

          <svg version="1.1" className={styles["cloud"]} id="cloud" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
               width="10px" height="10px" viewBox="0 0 10 10">
            <path fill="none"
                  d="M8.528,5.624H8.247c-0.085,0-0.156-0.068-0.156-0.154c0-0.694-0.563-1.257-1.257-1.257c-0.098,0-0.197,0.013-0.3,0.038C6.493,4.259,6.45,4.252,6.415,4.229C6.38,4.208,6.356,4.172,6.348,4.131C6.117,3.032,5.135,2.235,4.01,2.235c-1.252,0-2.297,0.979-2.379,2.23c-0.004,0.056-0.039,0.108-0.093,0.13C1.076,4.793,0.776,5.249,0.776,5.752c0,0.693,0.564,1.257,1.257,1.257h6.495c0.383,0,0.695-0.31,0.695-0.692S8.911,5.624,8.528,5.624z"></path>
          </svg>

          <div className={styles["rain"]}>
            <span className={styles["drop"]}></span>
            <span className={styles["drop"]}></span>
            <span className={styles["drop"]}></span>
            <span className={styles["drop"]}></span>
            <span className={styles["drop"]}></span>
            <span className={styles["drop"]}></span>
            <span className={styles["drop"]}></span>
            <span className={styles["drop"]}></span>
            <span className={styles["drop"]}></span>
            <span className={styles["drop"]}></span>
          </div>

          <div className={styles["text"]}>
            LOOKING OUTSIDE FOR YOU... ONE SEC
          </div>
        </div>
        }
        {!!this.props.providers.length &&
        <ForecastProviders intl={this.props.intl} providers={this.props.providers} forecast={this.props.forecast}
                           ratings={this.props.ratings}
                           onClick={this.onClickSetRate.bind(this)} isLoggedIn={this.props.isLoggedIn} showAll={(!this.state.loading && this.props.forecast.list && !!this.props.forecast.list.length)}/>}
      </div>
    );
  }
}

ForecastGetPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intlObj: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  location: PropTypes.object.isRequired
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

