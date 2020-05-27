import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container';
import { MARKER_SIZE, ICON, paymentOptions } from '../constants';

import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl';

export default function RequestDetailMapModal(props) {
    const [viewport, setViewport] = useState({
            latitude: props.currRequest.latitude,
            longitude: props.currRequest.longitude,
            zoom: 15,  
            bearing: 0,
            pitch: 0,
            width: 400,
            height: 400
        });

    const [lat, setLat] = useState(props.currRequest.latitude);
    const [long, setLong] = useState(props.currRequest.longitude);
    const [isLoaded, setIsLoaded] = useState(false);

    const navStyle = {
            position: 'absolute',
            top: 36,
            left: 0,
            padding: '10px'
        };

    const marker = () => {
            return (
                <Marker 
                    longitude={long} 
                    latitude={lat} 
                    draggable={true}
                    onDragEnd={(event) => { 
                        setLong(event.lngLat[0]);
                        setLat(event.lngLat[1]);
                    }}>

                    <svg height={MARKER_SIZE} 
                         viewBox="0 0 24 24"
                         style={{
                            cursor: 'pointer',
                            fill: '#2670FF',
                            stroke: 'none'
                         }}>
                         <path d={ICON}/>   
                    </svg>
                </Marker>
            )
        }

    useEffect(() => {
        setIsLoaded(true);
        
        
    }, [props.currRequest])

    if (isLoaded) {
        
    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title style={{margin: 'auto'}}>Request Location</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ReactMapGL
                    {...viewport}
                    onViewportChange={setViewport}
                    mapboxApiAccessToken={props.mapboxAccessToken}
                    mapStyle="mapbox://styles/mapbox/light-v9"
                    style={{margin: 'auto'}}>

                    <div style={navStyle}>
                        <NavigationControl/>
                    </div>
                    {marker()}
                
                </ReactMapGL>
            </Modal.Body>
        </>
    )} else {
        return (
            <></>
        )
    }
}