import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import MapGL from '@urbica/react-map-gl';
import NavigationControl from 'react-map-gl';
import useSupercluster from "use-supercluster";
import Pins from "./pins";
import InfoMarker from "./InfoMarker";
import Draw from '@urbica/react-map-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


export default function GeofenceMap(props) {
  const mapRef = useRef();
  const [popupInfo, setPopupInfo] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currRequest, setCurrRequest] = useState({});
  const [viewport, setViewport] = useState({
    latitude: 38.7528233,
    longitude: -98.1970437,
    zoom: 13,
    bearing: 0,
    pitch: 0,
  });
  const [mapBoxToken, setMapBoxToken] = useState("");
  const [modeId, setModeId] = useState(null);
  const [modeHandler, setModeHandler] = useState(null);
  
  const [geofences, setGeofences] = useState({
    type: "FeatureCollection",
    features: []
  });

  const [hasChanged, setHasChanged] = useState(false);

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
      props.association.name
    ) {

      if (props.association.name !== "Covaid"){
        setViewport({
          ...viewport,
          longitude: props.association.location.coordinates[0],
          latitude: props.association.location.coordinates[1],
          zoom: 8,
        });
      }
      

      if (props.association.geofences != undefined){
        handleAddProperties();
      } 
    }

  }, [props.association]);

  const _saveButton = () => {
    return (
      
        <Button variant="primary" 
                size="sm"
                onClick={hasChanged ? updateGeofence : null}
                disabled={!hasChanged}
                style={{marginLeft: "35px"}}
        >
          <b>Save</b>
        </Button>
     
    );
  };

  const handleAddProperties = () => {
    const newGeofences = {
      type: "FeatureCollection",
      features: [],
    }

    props.association.geofences.features.map((feature) => {
      const uFeature = {
        type: feature.type,
        properties: {},
        geometry: feature.geometry
      };

      newGeofences.features.push(uFeature);
    });

    
    setGeofences(
      newGeofences
    );
  }

  const handleChange = (data) => {
    setGeofences(data);
    setHasChanged(true);
  };

  const updateGeofence = async (e) => {
    e.preventDefault();
    let form = {
      associationID: props.association._id,
      geofences: geofences,
    };

    fetch("/api/association/update_geofences", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok) {
          setHasChanged(false);
          props.setAssociation({
            ...props.association,
            geofences: geofences,
          });
        } else {
          alert("unable to attach");
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  if (!isLoaded) {
    return <></>;
  }

  return (
    <>
      <Modal.Header>
          <Modal.Title style={{ marginLeft: 5 }}>
            <Row>
              <Col xl={11}>
                Organization Radius 
              </Col>
              <Col lg={1}>
                {_saveButton()} 
              </Col>
            </Row>
          </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      
        <MapGL
          {...viewport}
          style={{width: "100%", height: 450}}
          mapStyle="mapbox://styles/mapbox/light-v10"
          accessToken={mapBoxToken}
          onViewportChange={setViewport}
        >
          
          <Draw
            data={geofences}
            onChange={(data) => handleChange(data)}
            pointControl={false}
            lineStringControl={false}
            combineFeaturesControl={false}
            uncombineFeaturesControl={false}
          />
        </MapGL>
      </Modal.Body>
    </>
  );
}

GeofenceMap.propTypes = {
  association: PropTypes.object,
  public: PropTypes.bool,
};
