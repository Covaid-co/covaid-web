import React, { useState, useEffect, useRef } from 'react';
import MapGL, { Popup, NavigationControl, FullscreenControl }  from 'react-map-gl';
import useSupercluster from 'use-supercluster';
import Pins from './pins';
import InfoMarker from './InfoMarker'

export default function NewMap(props) {
    const mapRef = useRef();
    const [popupInfo, setPopupInfo] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
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
                console.log("Error");
            }
        });

        if (props.association && props.association.name && props.association.name !== "Covaid") {
            setViewport({
                ...viewport,
                latitude: props.association.location.coordinates[0],
                longitude: props.association.location.coordinates[1],
                zoom: 10
            })
        }
    }, [props.association, viewport])
    
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
            <Pins requests={props.requests} volunteers={props.volunteers} onClick={onClickMarker}
                  requesterMap={props.requesterMap} volunteerMap={props.volunteerMap} mode={props.mode}
                  unmatched={props.unmatched} matched={props.matched} completed={props.completed}/>
            <div style={navStyle}>
                <NavigationControl/>
            </div>
            <div style={fullscreenControlStyle}>
                <FullscreenControl/>
            </div>
            {popupInfo && (
                <Popup
                    tipSize={5}
                    anchor="top"
                    longitude={popupInfo.longitude}
                    latitude={popupInfo.latitude}
                    closeOnClick={false}
                    onClose={() => setPopupInfo(null)}>
                    <InfoMarker info={popupInfo} style={{color: 'black'}} 
                                setVolunteerDetailsModal={props.setVolunteerDetailsModal} 
                                setCurrVolunteer={props.setCurrVolunteer}
                                setRequestDetailsModal={props.setRequestDetailsModal} 
                            	setCurrRequest={props.setCurrRequest}
                                setPopupInfo = {setPopupInfo}
                                setInRequest={props.setInRequest}/>
                </Popup>
            )}
        </MapGL>
    );
}