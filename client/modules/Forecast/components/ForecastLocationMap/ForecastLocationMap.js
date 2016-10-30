import React, {Component, PropTypes} from 'react';
import {GoogleMapLoader, GoogleMap, Marker, withGoogleMap} from "react-google-maps";

export default function ForecastLocationMap (props) {
  let markers = [{
    position: {
      lat: 25.0112183,
      lng: 121.52067570000001,
    },
    key: `Taiwan`,
    defaultAnimation: 2,
  }];
  return (
    <section style={{height: "100%"}}>
      <GoogleMapLoader
        containerElement={
          <div
            {...props.containerElementProps}
            style={{
              height: "100%",
            }}
          />
        }
        googleMapElement={
          <GoogleMap
            ref={(map) => console.log(map)}
            defaultZoom={3}
            defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
            onClick={props.onMapClick}
          >
            {markers.map((marker, index) => {
              return (
                <Marker
                   />
              );
            })}
          </GoogleMap>
        }
      />
    </section>
  );
}
