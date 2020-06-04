import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import MapGL, {
  Popup,
  NavigationControl,
  FullscreenControl,
} from "react-map-gl";
import useSupercluster from "use-supercluster";
import Pins from "./pins";
import InfoMarker from "./InfoMarker";
import {Editor, EditingMode, DrawPolygonMode,} from 'react-map-gl-draw';


export default function GeofenceMap(props) {
  const mapRef = useRef();
  const [popupInfo, setPopupInfo] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currRequest, setCurrRequest] = useState({});
  const [viewport, setViewport] = useState({
    latitude: 38.7528233,
    longitude: -98.1970437,
    zoom: 10,
    bearing: 0,
    pitch: 0,
    width: "100%",
    height: 450,
  });
  const [mapBoxToken, setMapBoxToken] = useState("");
  const [modeId, setModeId] = useState(null);
  const [modeHandler, setModeHandler] = useState(null);

  useEffect(() => {
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

    if (
      props.association &&
      props.association.name &&
      props.association.name !== "Covaid"
    ) {
      setViewport({
        ...viewport,
        longitude: props.association.location.coordinates[0],
        latitude: props.association.location.coordinates[1],
        zoom: 10,
      });

    } console.log(props.association);
  }, [props.association]);

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

  const MODES = [
    { id: 'drawPolygon', text: 'Draw Polygon', handler: DrawPolygonMode },
    { id: 'editing', text: 'Edit Feature', handler: EditingMode },
  ];

  const _switchMode = evt => {
      const newModeId = evt.target.value === modeId ? null : evt.target.value;
      const mode = MODES.find(m => m.id === newModeId);
      const newModeHandler = mode ? new mode.handler() : null;
      setModeId(newModeId);
      setModeHandler(newModeHandler);
  };

  const _renderToolbar = () => {
    return (
      <div style={{position: 'absolute', top: 0, right: 0, maxWidth: '320px'}}>
        <select onChange={_switchMode}>
          <option value="">--Please choose a draw mode--</option>
          {MODES.map(mode => <option key={mode.id} value={mode.id}>{mode.text}</option>)}
        </select>
      </div>
    );
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
      <div style={navStyle}>
        <NavigationControl />
      </div>
      {popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          closeOnClick={false}
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          onClose={() => setPopupInfo(null)}
        >
          <InfoMarker
            info={popupInfo}
            request={currRequest}
            style={{ color: "black" }}
            {...props}
            setPopupInfo={setPopupInfo}
          />
        </Popup>
      )}

      <Editor
          clickRadius={12}
          mode={modeHandler}
        />

        {_renderToolbar()}
    </MapGL>
  );
}

GeofenceMap.propTypes = {
  association: PropTypes.object,
  public: PropTypes.bool,
};
