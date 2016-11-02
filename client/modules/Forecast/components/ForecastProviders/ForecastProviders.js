import React, {Component, PropTypes} from 'react';
import {injectIntl, FormattedMessage, FormattedDate} from 'react-intl';
import styles from  './ForecastProviders.css'

function ForecastProviders(props) {
  return (
    <div className={styles.container}>
      {props.providers.map(item => {
        return (
          <div className={styles.provider} key={item.provider._id}>
            <div className={styles["name"]}>
              <a target="_blank" href={item.provider.link}>
                {item.provider.displayName}
              </a>
              <span><FormattedMessage id="score_title"/>: {item.provider.rating}</span>
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
