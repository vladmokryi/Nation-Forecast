import React, {Component, PropTypes} from 'react';
import {withGoogleMap, GoogleMap, Marker} from "react-google-maps";
import styles from './ForecastLocationMap.css';

export default function ForecastLocationMap(props) {
  const GettingStartedGoogleMap = withGoogleMap(props => (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={props.marker.position}
    >
      <Marker
        {...props.marker}
      />
    </GoogleMap>
  ));

  return (
    <GettingStartedGoogleMap
      containerElement={
        <div className={styles['map-outer']}/>
      }
      mapElement={
        <div className={styles['map-inner']}/>
      }
      marker={props.marker}
    />
  );
}
