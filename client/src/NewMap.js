import React, {useState} from 'react';
import {render} from 'react-dom';
import MapGL, {Popup, NavigationControl, FullscreenControl, ScaleControl}  from 'react-map-gl';
import Pins from './pins';
import InfoMarker from './InfoMarker'

const MAPBOX_TOKEN = 'pk.eyJ1IjoibGlqZWZmcmV5MzkiLCJhIjoiY2s5MGUwMDNmMDBzdDNsbzFoY2VmZWNzOCJ9.8k5L4gUP4EF9AhvSylaIvw';

export default function NewMap(props) {
    const [viewport, setViewport] = useState({
        latitude: 38.7528233,
        longitude: -98.1970437,
        zoom: 3,
        bearing: 0,
        pitch: 0
    });

    const [popupInfo, setPopupInfo] = useState(null);
    
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
            // height="100vh"
            mapStyle="mapbox://styles/mapbox/light-v9"
            onViewportChange={setViewport}
            mapboxApiAccessToken={MAPBOX_TOKEN}>
            <Pins requests={props.requests} volunteers={props.volunteers} onClick={onClickMarker}
                  requesterMap={props.requesterMap} volunteerMap={props.volunteerMap}/>
            <div style={navStyle}>
                <NavigationControl />
            </div>
            <div style={fullscreenControlStyle}>
                <FullscreenControl />
            </div>
            {popupInfo && (
                <Popup
                    tipSize={5}
                    anchor="top"
                    longitude={popupInfo.longitude}
                    latitude={popupInfo.latitude}
                    // closeOnClick={true}
                    // closeOnMove={true}
                    onClose={() => setPopupInfo(null)}>
                    <InfoMarker info={popupInfo} style={{color: 'black'}}/>
                </Popup>
            )}
        </MapGL>
    );
}