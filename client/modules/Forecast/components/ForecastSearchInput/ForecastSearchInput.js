import React, {Component, PropTypes} from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
import styles from  './ForecastSearchInput.css';
import PlacesAutocomplete from 'react-places-autocomplete';
import {FaStarO, FaStar} from 'react-icons/lib/fa';

function ForecastSearchInput(props) {
  const cssClasses = {
    root: styles['autocomplete-container'] + (props.showStar ? ' ' + styles['signed'] : ''),
    input: styles['autocomplete-input']
  };
  return (
    <form onSubmit={props.onSubmit} className={styles.container}>
      { props.showStar &&
        <div className={styles["add-favorite"]}>
          { !props.isFavorite && <FaStarO onClick={props.addFavorite} color="gold" size="30"/> }
          { props.isFavorite && <FaStar onClick={props.addFavorite} color="gold" size="30"/> }
          </div>
      }
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
