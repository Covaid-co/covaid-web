import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import MapGL, { Popup, NavigationControl, FullscreenControl }  from 'react-map-gl';
import useSupercluster from 'use-supercluster';
import Pins from './pins';
import InfoMarker from './InfoMarker'

export default function NewMap(props) {
    const mapRef = useRef();
    const [popupInfo, setPopupInfo] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currRequest, setCurrRequest] = useState({});
    const [viewport, setViewport] = useState({
        latitude: 38.7528233,
        longitude: -98.1970437,
        zoom: 2.8,
        bearing: 0,
        pitch: 0,
        width: "100%",
        height: 450
    });
    const [mapBoxToken, setMapBoxToken] = useState('');

    useEffect(() => {
        fetch('/api/apikey/mapbox').then((response) => {
            if (response.ok) {
                response.json().then(key => {
                   setMapBoxToken(key['mapbox']);
                   setIsLoaded(true);
                });
            } else {
                alert("Error");
            }
        });

        if (props.association && props.association.name && props.association.name !== "Covaid") {
            setViewport({
                ...viewport,
                longitude: props.association.location.coordinates[0],
                latitude: props.association.location.coordinates[1],
                zoom: 10
            });
        }
    }, [props.association])
    
    const fullscreenControlStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        padding: '10px'
      };
      
    const navStyle = {
        position: 'absolute',
        top: 36,
        left: 0,
        padding: '10px'
    };

    const onClickMarker = (obj) => {
        // Request obj
        if (obj.location_info) {
            setCurrRequest(obj);
            obj = {
                    'name': obj.personal_info.requester_name,
                    'latitude': obj.location_info.coordinates[1],
                    'longitude': obj.location_info.coordinates[0]
                }
        } else {
            obj['name'] = obj.first_name;
        }
        setPopupInfo(obj);
    }

    const points = props.volunteers.map(volunteer => ({
        type: "Feature",
        properties: {
            cluster: false,
            id: volunteer._id
        },
        geometry: { type: "Point", coordinates: [volunteer.longitude, volunteer.latitude] }
    }));

    // [lat, long, lat, long]
    const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null;

    const { clusters, supercluster } = useSupercluster({
        points,
        zoom: viewport.zoom,
        bounds,
        options: { radius: 75, maxZoom: 20 }
    })

    if (!isLoaded) {
        return <></>
    }

    if (props.public) {
        return (
            <MapGL {...viewport} mapStyle="mapbox://styles/lijeffrey39/ck9hiqyoq4w001ilenf9zx129" width="100%" 
                height="450px" mapboxApiAccessToken={mapBoxToken} ref={mapRef}
                onViewportChange={(newViewPort) => {
                    setViewport({ ...newViewPort })
                }}>
                <Pins volunteers={props.volunteers} setViewport={setViewport} viewport={viewport}
                      public={true} clusters={clusters} supercluster={supercluster}/>
                <div style={navStyle}>
                    <NavigationControl/>
                </div>
                <div style={fullscreenControlStyle}>
                    <FullscreenControl/>
                </div>
            </MapGL>
        )
    }

    return (
        <MapGL {...viewport} mapStyle="mapbox://styles/mapbox/light-v9" onViewportChange={setViewport} mapboxApiAccessToken={mapBoxToken}>
            <Pins { ...props } onClick={onClickMarker}/>
            <div style={navStyle}>
                <NavigationControl/>
            </div>
            <div style={fullscreenControlStyle}>
                <FullscreenControl/>
            </div>
            {popupInfo && (
                <Popup tipSize={5} anchor="top" closeOnClick={false}
                    longitude={popupInfo.longitude}
                    latitude={popupInfo.latitude}
                    onClose={() => setPopupInfo(null)}>
                    <InfoMarker info={popupInfo} request={currRequest} style={{color: 'black'}} { ...props } setPopupInfo = {setPopupInfo}/>
                </Popup>
            )}
        </MapGL>
    );
}


NewMap.propTypes = {
    volunteers: PropTypes.array,
    association: PropTypes.object,
    public: PropTypes.bool
};