import React from "react";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Display/Change Current Location (city, zipcode)
 */

export default function CurrentLocation(props) {
  return (
    <p id="regular-text" style={{ marginBottom: 0 }}>
      {props.translations
        ? props.translations[props.language].currentLocation
        : "Current Location"}
      :
      <button id="change-location" onClick={props.showModal}>
        {props.locationProps.locality + ", " + props.locationProps.zipcode}
        <FontAwesomeIcon
          style={{ color: "red", marginLeft: 5 }}
          icon={faMapMarkerAlt}
        />
      </button>
    </p>
  );
}
