import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {fetchForecast, fetchProviders} from '../../ForecastActions';
import {getForecast, getProviders} from '../../ForecastReducer';
import ForecastSearchInput from '../../components/ForecastSearchInput/ForecastSearchInput';
import ForecastProviders from '../../components/ForecastProviders/ForecastProviders';
import ForecastLocationMap from '../../components/ForecastLocationMap/ForecastLocationMap';
import {geocodeByAddress} from 'react-places-autocomplete'

class ForecastGetPage extends Component {
  constructor(props) {
    super(props);
    this.state = {address: ''};
    this.onChange = (address) => this.setState({address});
  }

  componentDidMount() {
    this.props.dispatch(fetchProviders());
  }

  handleFormSubmit(event) {
    event.preventDefault();
    const {address} = this.state;

    geocodeByAddress(address, (err, {lat, lng}) => {
      if (err) {
        console.log('Oh no!', err)
      }
      console.log(`Yay! got latitude and longitude for ${address}`, {lat, lng});
      this.props.dispatch(fetchForecast({lat, lon: lng}));
    })
  }

  render() {
    return (
      <div>
        <ForecastSearchInput onSubmit={this.handleFormSubmit.bind(this)}
                             address={this.state.address} onChange={this.onChange.bind(this)}/>
        <ForecastLocationMap/>
        <ForecastProviders providers={this.props.providers}/>
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
    providers: getProviders(store)
  };
}

export default connect(mapStateToProps)(ForecastGetPage);

