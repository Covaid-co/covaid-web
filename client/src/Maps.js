import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import MarkerInfo from './MarkerInfo';

const mapStyles = {
    width: '91%',
    height: '520px',
}

export class MapContainer extends Component {
    constructor(props) {
        super(props);

        //   var assocLat = 38.7528233
        //   var assocLong = -98.1970437
        //   var customZoom = 4

        //   if (this.props.association.name !== "Covaid") {
        //       assocLat = this.props.association.location.coordinates[0]
        //       assocLong = this.props.association.location.coordinates[1]
        //       customZoom = 9
        //   }
    
        this.state = {
            selectedPlace: {},
            activeMarker: {},
            showingInfoWindow: false,
            isRequest: false,
            defaultIcon: {
                url: 'https://www.pinclipart.com/picdir/big/17-171343_maps-clipart-map-pin-google-maps-marker-blue.png', // url
                scaledSize: new props.google.maps.Size(26, 42) // scaled size
            }
        }

        this.onMarkerClick = this.onMarkerClick.bind(this);
    }

    onMarkerClick(props, marker, e) {
        console.log(marker)
        this.setState({
            isRequest: props.isRequest,
            selectedPlace: props.request,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }

    onClose = props => {
        if (this.state.showingInfoWindow) {
          this.setState({
            showingInfoWindow: false,
            activeMarker: null
          });
        }
    };

    displayMarkers = () => {
        var requesterMarkers = [];
        var volunteerMarkers = [];
        if (!this.props.requests) {
            return <Marker></Marker>
        } else {
            // console.log(this.props.volunteers)
            // console.log(this.props.requests);
            const copy = JSON.parse(JSON.stringify(this.props.volunteers));
            copy.push(...this.props.requests);
            return copy.map((request, index) => {
                if (request.requester_first) {
                    return <Marker key={index + 'request'} id={index + 'request'} position={{
                            lat: request.latitude,
                            lng: request.longitude
                        }}
                        request={request}
                        isRequest={true}
                        // icon={this.state.defaultIcon}
                        onClick={this.onMarkerClick}/>
                } else {
                    return <Marker key={index + 'volunteer'} id={index + 'volunteer'} position={{
                            lat: request.latitude,
                            lng: request.longitude
                        }}
                        request={request}
                        isRequest={false}
                        // icon={this.state.defaultIcon}
                        onClick={this.onMarkerClick}/>
                }
            })
            volunteerMarkers = this.props.volunteers.map((request, index) => {
                return <Marker key={index + 'volunteer'} id={index + 'volunteer'} position={{
                                lat: request.latitude,
                                lng: request.longitude
                            }}
                            request={request}
                            isRequest={false}
                            // icon={this.state.defaultIcon}
                            onClick={this.onMarkerClick}/>
            })
            requesterMarkers = this.props.requests.map((request, index) => {
                return <Marker key={index + 'request'} id={index + 'request'} position={{
                                lat: request.latitude,
                                lng: request.longitude
                            }}
                            isRequest={true}
                            request={request}
                            onClick={this.onMarkerClick}/>
            });
            console.log(volunteerMarkers[0])
            console.log(requesterMarkers[0])
            return requesterMarkers;
            if (this.props.requesterMap && this.props.volunteerMap) {
                volunteerMarkers.push(...requesterMarkers);
                return volunteerMarkers;
            } else if (this.props.requesterMap) {
                return requesterMarkers;
            } else if (this.props.volunteerMap) {
                return volunteerMarkers;
            }
        }
    }

    // shouldComponentUpdate(nextProps,nextState) {
    //     return (this.state.selectedCenter !== nextState.selectedCenter);
    // }

    displayInfo = () => {
        if (Object.keys(this.state.selectedPlace).length === 0) {
            return <></>;
        }
        console.log(this.state.selectedPlace)
        if (this.state.isRequest) {
            return (
                <h1>{this.state.selectedPlace.requester_first}</h1>
            )
        }
        return (
            <h1>{this.state.selectedPlace.first_name}</h1>
        )
    }
  
    render() {
        return (
            <Map
                visible={true}
                google={this.props.google}
                zoom={4}
                style={mapStyles}
                initialCenter={{ lat: 38.7528233, lng: -98.1970437}}>
                {this.displayMarkers()}
                {/* <InfoWindow
                    visible={this.state.showingInfoWindow}
                    marker={this.state.activeMarker}
                    onClose={this.onClose}>
                    <div style={{color: 'black'}}>
                        {this.displayInfo()}
                    </div>
                </InfoWindow> */}
            </Map>
        );
    }
}

export default GoogleApiWrapper(
    (props) => ({
        apiKey: 'AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY',
        requesterMap: props.requesterMap,
        volunteerMap: props.volunteerMap,
        requests: props.requests
    }
))(MapContainer);