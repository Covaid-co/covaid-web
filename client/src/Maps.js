import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

export class MapContainer extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        stores: [{lat: 47.49855629475769, lng: -122.14184416996333},
                {latitude: 47.359423, longitude: -122.021071},
                {latitude: 47.2052192687988, longitude: -121.988426208496},
                {latitude: 47.6307081, longitude: -122.1434325},
                {latitude: 47.3084488, longitude: -122.2140121},
                {latitude: 47.5524695, longitude: -122.0425407}],
        mapStyles: {
                    width: '93%',
                    height: '500px',
                  }
      }
    }
  
    displayMarkers = () => {
        console.log(this.props.requests)
        if (!this.props.requests) {
            return <Marker></Marker>
        }
        return this.props.requests.map((request, index) => {
            return <Marker key={index} id={index} position={{
             lat: request.latitude,
             lng: request.longitude
           }}
           onClick={() => console.log("You clicked me!")} />
        })
    //   return this.state.stores.map((store, index) => {
    //     return <Marker key={index} id={index} position={{
    //      lat: store.latitude,
    //      lng: store.longitude
    //    }}
    //    onClick={() => console.log("You clicked me!")} />
    //   })
    }
  
    render() {
        // if (this.props.hide) {
        //     return (<></>)
        // } else {
        //     return (
            return (
                <Map
                    visible={this.props.show}
                    google={this.props.google}
                    zoom={4}
                    style={this.state.mapStyles}
                    initialCenter={{ lat: 38.7528233, lng: -98.1970437}}
                >
                    {this.displayMarkers()}
                </Map>
            );
        // }
    }
}

export default GoogleApiWrapper(
    (props) => ({
        apiKey: 'AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY',
        show: props.show,
        requests: props.requests
    }
))(MapContainer);