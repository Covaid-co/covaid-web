import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Marker } from "react-map-gl";
import { MARKER_SIZE, ICON } from "../constants";
import MapGL, { NavigationControl, FullscreenControl } from "react-map-gl";

export default function LocationMap(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 38.7528233,
    longitude: -98.1970437,
    zoom: 2.8,
    bearing: 0,
    pitch: 0,
    width: "100%",
    height: 450,
  });
  const [mapBoxToken, setMapBoxToken] = useState("");

  useEffect(() => {
    if (mapBoxToken === "") {
      fetch("/api/apikey/mapbox").then((response) => {
        if (response.ok) {
          response.json().then((key) => {
            setMapBoxToken(key["mapbox"]);
            setIsLoaded(true);
          });
        } else {
          alert("Error");
        }
      });
    }

    if (props.locationInfo.latitude && props.locationInfo.longitude) {
      setViewport({
        ...viewport,
        longitude: props.locationInfo.longitude,
        latitude: props.locationInfo.latitude,
        zoom: 11,
      });
    }
  }, [props.locationInfo]);

  const fullscreenControlStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    padding: "10px",
  };

  const navStyle = {
    position: "absolute",
    top: 36,
    left: 0,
    padding: "10px",
  };

  if (!isLoaded) {
    return <></>;
  }

  return (
    <MapGL
      {...viewport}
      mapStyle="mapbox://styles/mapbox/light-v9"
      onViewportChange={setViewport}
      mapboxApiAccessToken={mapBoxToken}
    >
      {props.locationInfo.longitude && props.locationInfo.latitude ? (
        <Marker
          longitude={props.locationInfo.longitude}
          latitude={props.locationInfo.latitude}
        >
          <svg
            height={MARKER_SIZE}
            viewBox="0 0 24 24"
            style={{
              cursor: "pointer",
              fill: "#2670FF",
              stroke: "none",
              transform: `translate(${-MARKER_SIZE / 2}px,${-MARKER_SIZE}px)`,
            }}
          >
            <path d={ICON} />
          </svg>
        </Marker>
      ) : (
        <></>
      )}
      <div style={navStyle}>
        <NavigationControl />
      </div>
      <div style={fullscreenControlStyle}>
        <FullscreenControl />
      </div>
    </MapGL>
  );
}
