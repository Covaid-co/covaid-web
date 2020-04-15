import React, { useState } from "react";
import { Marker, InfoWindow } from 'google-maps-react';

const MarkerInfo = (props) => {

    const [selectedPlace, setSelectedPlace] = useState({});
    const [activeMarker, setActiveMarker] = useState({});
    const [showWindow, setShowWindow] = useState(false);

    const onMarkerClick = (props, marker, e) => {
        setSelectedPlace(props.request);
        setActiveMarker(marker);
        setShowWindow(true);
    }

    const displayMarkers = () => {
        if (!props.requests) {
            return <Marker></Marker>
        }
        return props.requests.map((request, index) => {
            return <Marker key={index} id={index} position={{
             lat: request.latitude,
             lng: request.longitude
           }}
           request={request}
           onClick={onMarkerClick}/>
        })
    }

    return (
        <Marker 
        initialCenter={{ lat: 38.7528233, lng: -98.1970437}}
            position={{
            lat: 47.49855629475769,
            lng: -122.14184416996333
        }}/>
        // <>
        //      <Marker position={{
        //             lat: 47.49855629475769,
        //             lng: -122.14184416996333
        //         }}/>
        //     {displayMarkers()}
        //     <InfoWindow
        //         visible={showWindow}
        //         marker={activeMarker}>
        //         <div style={{color: 'black'}}>
        //             <h1>{selectedPlace ? selectedPlace.requester_first : ""}</h1>
        //         </div>
        //     </InfoWindow>
        // </>
    );
}

export default MarkerInfo;