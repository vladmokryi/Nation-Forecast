import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {fetchForecast, fetchProviders, setForecast} from '../../ForecastActions';
import {getForecast, getProviders} from '../../ForecastReducer';
import {getAllRatings} from '../../../User/UserReducer';
import {setRating, getRatings} from '../../../User/UserActions';
import ForecastSearchInput from '../../components/ForecastSearchInput/ForecastSearchInput';
import ForecastProviders from '../../components/ForecastProviders/ForecastProviders';
import ForecastLocationMap from '../../components/ForecastLocationMap/ForecastLocationMap';
import ForecastCurrent from '../../components/ForecastCurrent/ForecastCurrent';
import {geocodeByAddress} from 'react-places-autocomplete'
import styles from './ForecastGetPage.css';
import {isLoggedIn} from '../../../../util/apiCaller';

class ForecastGetPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '', marker: {}
    };
  }

  onChangeInput = (address) => {
    this.setState({address});
  };

  onSelectInput = (address) => {
    this.setState({address}, this.handleFormSubmit.bind(this));
  };

  componentDidMount() {
    this.props.dispatch(fetchProviders());
    if (this.props.isLoggedIn) {
      this.props.dispatch(getRatings());
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
          this.setState({marker: marker});
          this.props.dispatch(setForecast({}));
          this.props.dispatch(fetchForecast({lat, lon: lng}));
        }
      });
    } else {
      this.setState({marker: {}});
    }
  };

  onClickSetRate = (id) => {
    this.props.dispatch(setRating(id, this.handleFormSubmit.bind(this)));
  };

  render() {
    return (
      <div>
        <ForecastSearchInput onSubmit={this.handleFormSubmit.bind(this)}
                             address={this.state.address} onChange={this.onChangeInput.bind(this)}
                             onSelect={this.onSelectInput.bind(this)}/>
        {(this.props.forecast.list && !!this.props.forecast.list.length) && <div className={styles["forecast-container"]}>
          <ForecastLocationMap marker={this.state.marker}/>
          <ForecastCurrent forecast={this.props.forecast}/>
        </div>}
        {!!this.props.providers.length && <ForecastProviders providers={this.props.providers} ratings={this.props.ratings}
                           onClick={this.onClickSetRate.bind(this)} isLoggedIn={this.props.isLoggedIn}/>}
      </div>
    );
  }
}

ForecastGetPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    forecast: getForecast(store),
    providers: getProviders(store),
    ratings: getAllRatings(store),
    isLoggedIn: isLoggedIn()
  };
}

export default connect(mapStateToProps)(ForecastGetPage);

