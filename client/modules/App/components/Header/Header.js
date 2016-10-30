import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import Flag from 'react-flags';

// Import Style
import styles from './Header.css';

export function Header(props, context) {
  const languageNodes = props.intl.enabledLanguages.map(
    lang => (
      <span key={lang} onClick={() => props.switchLanguage(lang)} className={lang === props.intl.locale ? styles.selected : ''}>
         <Flag
           name={lang.toUpperCase()}
         />
      </span>
    )
  );

  return (
    <div className={styles.header}>
      <div className={styles['logo']}>
        <a href="/">National Forecast</a>
      </div>
      <div className={styles['language-switcher']}>
        <ul>
          {languageNodes}
        </ul>
      </div>
      <div className={styles['user-bar']}>
        <div>UserBar</div>
      </div>
    </div>
  );
}

Header.contextTypes = {
  router: React.PropTypes.object,
};

Header.propTypes = {
  switchLanguage: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default Header;
