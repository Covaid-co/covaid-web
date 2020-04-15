import React, { useState, useEffect } from 'react';
import MapGL, { Popup, NavigationControl, FullscreenControl }  from 'react-map-gl';
import Pins from './pins';
import InfoMarker from './InfoMarker'

const MAPBOX_TOKEN = 'pk.eyJ1IjoibGlqZWZmcmV5MzkiLCJhIjoiY2s5MGUwMDNmMDBzdDNsbzFoY2VmZWNzOCJ9.8k5L4gUP4EF9AhvSylaIvw';

export default function NewMap(props) {
    const [viewport, setViewport] = useState({
        latitude: 38.7528233,
        longitude: -98.1970437,
        zoom: 2.8,
        bearing: 0,
        pitch: 0
    });
    const [popupInfo, setPopupInfo] = useState(null);

    useEffect(() => {
        if (props.association.name && props.association.name !== "Covaid") {
            setViewport({
                ...viewport,
                latitude: props.association.location.coordinates[0],
                longitude: props.association.location.coordinates[1],
                zoom: 10
            })
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
        setPopupInfo(obj);
    }
      

    return (
        <MapGL
            {...viewport}
            width="100%"
            height="450px"
            mapStyle="mapbox://styles/mapbox/light-v9"
            onViewportChange={setViewport}
            mapboxApiAccessToken={MAPBOX_TOKEN}>
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
                                setPopupInfo = {setPopupInfo}/>
                </Popup>
            )}
        </MapGL>
    );
}