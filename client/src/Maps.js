import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

export class MapContainer extends Component {
    constructor(props) {
      super(props);

      var assocLat = 38.7528233
      var assocLong = -98.1970437
      var customZoom = 4

      if (this.props.association.name !== "Covaid") {
          assocLat = this.props.association.location.coordinates[0]
          assocLong = this.props.association.location.coordinates[1]
          customZoom = 10
      }
  
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
                  },
        lat: assocLat,
        lng: assocLong,
        zoom: customZoom
      }
    }

    displayMarkers = () => {
        
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
    }
  
    render() {
            return (
                <Map
                    visible={this.props.show}
                    google={this.props.google}
                    zoom={this.state.zoom}
                    style={this.state.mapStyles}
                    initialCenter={{ lat: this.state.lat, lng: this.state.lng}}
                >
                    {this.displayMarkers()}
                </Map>
            );
    }
}

export default GoogleApiWrapper(
    (props) => ({
        apiKey: 'AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY',
        show: props.show,
        requests: props.requests
    }
))(MapContainer);