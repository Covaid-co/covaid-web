import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import { MARKER_SIZE, ICON, paymentOptions } from "../constants";

import ReactMapGL, {
  Marker,
  NavigationControl,
  Popup,
  FullscreenControl,
} from "react-map-gl";

export default function MapDetail(props) {
  const [popupInfo, setPopupInfo] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: props.currVolunteer.latitude, //props.latlong[1],
    longitude: props.currVolunteer.longitude, //props.latlong[0],
    zoom: 11,
    bearing: 0,
    pitch: 0,
    width: 468,
    height: 400,
  });

  const [isLoaded, setIsLoaded] = useState(false);

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

  // const handleCloseMap = () => {
  //     props.setVolunteerDetailsModal(true);
  //     props.setMapModal(false);
  // }
  const marker = () => {
    return (
      <Marker
        longitude={props.currVolunteer.longitude}
        latitude={props.currVolunteer.latitude}
        draggable={true}
      >
        <svg
          height={MARKER_SIZE}
          viewBox="0 0 24 24"
          style={{
            cursor: "pointer",
            fill: "#2670FF",
            stroke: "none",
          }}
        >
          <path d={ICON} />
        </svg>
      </Marker>
    );
  };

  useEffect(() => {
    setIsLoaded(true);
  }, [props.currVolunteer]);

  if (isLoaded) {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Volunteer Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReactMapGL
            {...viewport}
            mapStyle="mapbox://styles/mapbox/light-v9"
            onViewportChange={setViewport}
            mapboxApiAccessToken={props.mapBoxToken}
          >
            <div style={navStyle}>
              <NavigationControl />
            </div>
            {marker()}
          </ReactMapGL>
        </Modal.Body>
      </>
    );
  } else {
    return <></>;
  }
}
