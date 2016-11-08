import React, {Component, PropTypes} from 'react';
import styles from './ForecastCurrent.css';
import {FormattedDate, FormattedMessage} from 'react-intl';

export default function ForecastCurrent(props) {
  return (
    <div className={styles['forecast-current']}>
      {props.forecast.list.map(day => {
        let date = new Date(day.date);
        return (
          <div key={day.date} className={styles['day-container']}>
            <div className={styles.day}>
              <p className={styles['day-of-week']}>
                <FormattedDate value={date} weekday='long'/>
              </p>
              <p className={styles.date}>
                <FormattedDate value={date} day='2-digit'/>
              </p>
              <p className={styles.month}>
                <FormattedDate value={date} month='long'/>
              </p>

              <div className={styles.temperature}>
                <div className={styles.min}>
                  <FormattedMessage id="min_title"/>
                  <div>{day.min.toFixed(1)}&deg;</div>
                </div>
                <div className={styles.max}>
                  <FormattedMessage id="max_title"/>
                  <div>{day.max.toFixed(1)}&deg;</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )
}
