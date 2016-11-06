import React, {Component, PropTypes} from 'react';
import {injectIntl, FormattedMessage, FormattedDate} from 'react-intl';
import styles from  './ForecastProviders.css';
import {isLoggedIn} from '../../../../util/apiCaller';
import {FaThumbsODown, FaThumbsOUp} from 'react-icons/lib/fa';

function ForecastProviders(props) {
  return (
    <div className={styles.container}>
      {props.providers.map(item => {
        let active = !!props.ratings[item.provider._id];
        return (
          <div className={styles.provider} key={item.provider._id}>
            <div className={styles["name"]}>
              <div className={styles["info"]}>
                <a target="_blank" href={item.provider.link}>
                  {item.provider.displayName}
                </a>
                <span className={styles["rating"]}><FormattedMessage id="score_title"/>: {item.provider.rating}</span>
              </div>
              { props.isLoggedIn &&
                <div onClick={props.onClick.bind(this, item.provider._id)} className={styles["give-rating"]}>
                  {active && <FaThumbsODown color="#c9c9c9" size={30}/>}
                  {!active && <FaThumbsOUp color="#c9c9c9" size={30}/>}
                </div>
              }
            </div>
            <div className={styles["weather"]}>
              {item.list && item.list.map(day => {
                return (
                  <div key={day.date}>
                    <p><FormattedDate day="2-digit" month="2-digit" value={new Date(day.date)}/></p>
                    <div className={styles.avg}>
                      <FormattedMessage id="avg_title"/>
                      <div>{day.avg.toFixed(2)}&deg;</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  );
}

export default injectIntl(ForecastProviders);
