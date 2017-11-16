import React, {Component, PropTypes} from 'react';
import styles from './ForecastCurrent.css';
import {FormattedDate, FormattedMessage} from 'react-intl'
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import {FaTint, FaFlag} from 'react-icons/lib/fa';

export default function ForecastCurrent(props) {
  let getWindTitle = (day) => {
    let message = props.intl.formatMessage({id: 'wind_speed_avg'});
    if (day.wind.gust && day.wind.speed !== day.wind.gust) {
      message += '. ' + props.intl.formatMessage({id: 'wind_gust'}) + ' ' + day.wind.gust.toFixed(0) +  props.intl.formatMessage({id: 'meter_per_second'});
    }
    return message;
  };
  let formatDate = (date, message) => {
    return props.intl.formatDate(date, { weekday: 'long'}) + ' ' +  props.intl.formatDate(date, { day: '2-digit', month: '2-digit'})
      + ' ' + props.intl.formatMessage({id: message});
  };
  let chartData = [];
  props.forecast.list.forEach(function (item) {
    chartData.push({name: formatDate(new Date(item.date), 'min_title'), value: parseFloat(item.min.toFixed(2))});
    chartData.push({name: formatDate(new Date(item.date), 'avg_title'), value: parseFloat(item.avg.toFixed(2))});
    chartData.push({name: formatDate(new Date(item.date), 'max_title'), value: parseFloat(item.max.toFixed(2))});
  });
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

              <div className={styles.temperature}>
                <div className={styles.min}>
                  <span title={props.intl.formatMessage({id: "humidity_title"})}>
                    <FaTint color="#c9c9c9"/> {day.humidity.toFixed(0)}%
                  </span>
                </div>
                <div className={styles.max}>
                  <span title={getWindTitle(day)}>
                    <FaFlag color="#c9c9c9"/> {day.wind.speed.toFixed(0)} <FormattedMessage id="meter_per_second"/>
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <hr />
      <div className={styles['forecast-current-graph']}>
        <ResponsiveContainer>
          <AreaChart data={chartData} stackOffset="silhouette">
            <Tooltip/>
            <Area type='monotone' dataKey='value' stroke='#8884d8' name={props.intl.formatMessage({id: "temperature_chart"})}  fill='#8884d8' />
            <XAxis dataKey="name" hide={true}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
