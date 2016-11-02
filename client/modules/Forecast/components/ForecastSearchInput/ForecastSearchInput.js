import React, {Component, PropTypes} from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
import styles from  './ForecastSearchInput.css';
import PlacesAutocomplete from 'react-places-autocomplete'

function ForecastSearchInput(props) {
  return (
    <form onSubmit={props.onSubmit} className={styles.container}>
      <PlacesAutocomplete
        value={props.address}
        onChange={props.onChange}
        hideLabel={true}
        placeholder="Your place name..."
      />
      <button type="submit"><FormattedMessage id="search_title"/></button>
    </form>
  );
}

export default injectIntl(ForecastSearchInput);
