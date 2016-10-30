import React, { Component, PropTypes } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import styles from  './ForecastProviders.css'

function ForecastProviders (props) {
  return (
    <div className={styles.container}>
      {props.providers.map(item => {
        return (
          <div className={styles.provider} key={item.provider._id}>
            <div className={styles["name"]}>
              <a target="_blank" href={item.provider.link}>
                {item.provider.displayName}
              </a>
              <span>score: {item.provider.rating}</span>
            </div>
            <div className={styles["weather"]}>
              {item.list && item.list.map(day => {
                let formatedDate = (value) => {
                  let date = new Date(value);
                  let day = date.getDate();
                  let month = date.getMonth() + 1;
                  return (day < 10 ? '0' + day : day) + '/' + (month < 10 ? '0' + month : month);
                };
                return (
                  <div key={day.date}>
                    <p>{formatedDate(day.date)}</p>
                    <div className={styles.avg}>
                        avg
                        <span>{day.avg.toFixed(2)}&deg;</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className={styles["give-rating"]}>
              +1
            </div>
          </div>
        )
      })}
    </div>
  );
}

export default injectIntl(ForecastProviders);
