import React from 'react';
import { injectIntl} from 'react-intl';

// Import Style
import styles from './FavoriteLocations.css';

function FavoriteLocations(props) {
    return (
      <div className={styles['favorite-container']}>
        {props.user.favoriteLocations.map((item, index) => { return (
          <a key={index} onClick={function() { props.onClick(item); }}>
            <small>{ item.name }</small>
          </a>
        );})}
      </div>
    );
}
export default injectIntl(FavoriteLocations);
