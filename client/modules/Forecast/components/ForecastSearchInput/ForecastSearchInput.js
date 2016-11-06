import React, {Component, PropTypes} from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
import styles from  './ForecastSearchInput.css';
import PlacesAutocomplete from 'react-places-autocomplete'

function ForecastSearchInput(props) {
  const cssClasses = {
    root: styles['autocomplete-container'],
    input: styles['autocomplete-input']
  };
  return (
    <form onSubmit={props.onSubmit} className={styles.container}>
      <PlacesAutocomplete
        value={props.address}
        onChange={props.onChange}
        onSelect={props.onSelect}
        hideLabel={true}
        classNames={cssClasses}
        placeholder={props.intl.formatMessage({id: "search_placeholder"})}
      />
      <button className={styles["search-btn"]} type="submit"><FormattedMessage id="search_title"/></button>
    </form>
  );
}

export default injectIntl(ForecastSearchInput);
