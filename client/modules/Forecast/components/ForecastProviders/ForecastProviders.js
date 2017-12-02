import React, {Component, PropTypes} from 'react';
import {injectIntl, FormattedMessage, FormattedDate} from 'react-intl';
import styles from  './ForecastProviders.css';
import {isLoggedIn} from '../../../../util/apiCaller';
import {FaThumbsUp, FaThumbsOUp, FaTint, FaFlag} from 'react-icons/lib/fa';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import * as _ from "lodash";

function ForecastProviders(props) {
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
  let getChartData = (list) => {
    let chartData = [];
    list.forEach(function (item) {
      chartData.push({name: formatDate(new Date(item.date), 'min_title'), value: parseFloat(item.min.toFixed(2))});
      chartData.push({name: formatDate(new Date(item.date), 'avg_title'), value: parseFloat(item.avg.toFixed(2))});
      chartData.push({name: formatDate(new Date(item.date), 'max_title'), value: parseFloat(item.max.toFixed(2))});
    });
    return chartData;
  };
  let hightLightClass = (avg, index) => {
    if (props.forecast.list && props.forecast.list[index]) {
      let diff = avg - props.forecast.list[index].avg;
      if (diff >= 1) {
        return styles["text-success-light"];
      } else if (diff <= -1) {
        return styles["text-danger-light"];
      } else {
        return '';
      }
    } else {
      return '';
    }
  };

  let isHasActiveRate = false;
  _.forEach(props.providers, (item)=> {
    let active = !!props.ratings[item.provider._id];
    if (active) {
      isHasActiveRate = true;
    }
  });
  let cssClass = styles["name"] + (!props.showAll ? ' ' + styles["full"]: '');

  return (
    <div className={styles.container}>
      {props.providers.map(item => {
        let active = !!props.ratings[item.provider._id];
        return (
          <div className={styles.provider} key={item.provider._id}>
            <div className={cssClass}>
              <div className={styles["info"]}>
                <a target="_blank" href={item.provider.link}>
                  {item.provider.displayName}
                </a>
                <span className={styles["rating"]}><FormattedMessage id="score_title"/>: {item.provider.rating}</span>
              </div>
              { props.isLoggedIn &&
                <div onClick={props.onClick.bind(this, item.provider._id)} className={styles["give-rating"]}>
                  {active && <FaThumbsUp color="#00aff0" size={40}/>}
                  {!active && !isHasActiveRate && <FaThumbsOUp color="#c9c9c9" size={30}/>}
                </div>
              }
            </div>
            { props.showAll && <div className={styles["weather"]}>
              {item.list &&
              <div>
                {
                  item.list.map((day, index) => {
                    return (
                      <div key={day.date} className={styles["weather-day"]}>
                        <p><FormattedDate day="2-digit" month="2-digit" value={new Date(day.date)}/></p>
                        <div className={styles.avg}>
                          <FormattedMessage id="avg_title"/>
                          <div className={hightLightClass(day.avg, index)}>{day.avg.toFixed(2)}&deg;</div>
                          <span title={props.intl.formatMessage({id: "humidity_title"})}>
                            <FaTint color="#c9c9c9"/> {day.humidity.toFixed(0)}%
                          </span>
                          <span title={getWindTitle(day)}>
                            <FaFlag color="#c9c9c9"/> {day.wind.speed.toFixed(0)} <FormattedMessage
                            id="meter_per_second"/>
                          </span>
                        </div>
                      </div>
                    )
                  })
                }
                <hr />
                <div className={styles["weather-graph"]}>
                  <ResponsiveContainer>
                    <AreaChart data={getChartData(item.list)} stackOffset="silhouette">
                      <Tooltip/>
                      <Area type='monotone' dataKey='value' name={props.intl.formatMessage({id: "temperature_chart"})}
                            stroke='#8884d8' fill='#8884d8'/>
                      <XAxis dataKey="name" hide={true}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              }
            </div>
            }
          </div>
        )
      })}
    </div>
  );
}

export default injectIntl(ForecastProviders);
