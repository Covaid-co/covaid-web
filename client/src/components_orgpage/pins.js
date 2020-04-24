import React, {PureComponent} from 'react';
import {Marker} from 'react-map-gl';

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const SIZE = 20;

// Important for perf: the markers never change, avoid rerender when the map viewport changes
export default class Pins extends PureComponent {
  render() {
    const {onClick, mode} = this.props;

    var volunteerMarkers = this.props.volunteers.map((request, index) => {
        return <Marker key={`volunteer-${index}`} longitude={request.longitude} latitude={request.latitude}>
                    <svg
                    height={SIZE}
                    viewBox="0 0 24 24"
                    style={{
                        cursor: 'pointer',
                        fill: '#2670FF',
                        stroke: 'none',
                        transform: `translate(${-SIZE / 2}px,${-SIZE}px)`
                    }}
                    onClick={() => onClick(request)}
                    >
                    <path d={ICON} />
                    </svg>
                </Marker>
    })
    var realRequests = [];
    var color = '#DB4B4B';
    if (mode === 1) {
        realRequests = this.props.unmatched;
    } else if (mode === 2) {
        realRequests = this.props.matched;
        color = '#db9327';
    } else if (mode === 3) {
        realRequests = this.props.completed;
        color = '#28a745';
    }
    var requesterMarkers = realRequests.map((request, index) => {
        return  <Marker key={`requester-${index}`} longitude={request.longitude} latitude={request.latitude}>
                    <svg
                    height={SIZE}
                    viewBox="0 0 24 24"
                    style={{
                        cursor: 'pointer',
                        fill: request.volunteer_status === 'pending' ? '#8A8A8A': color,
                        stroke: 'none',
                        transform: `translate(${-SIZE / 2}px,${-SIZE}px)`
                    }}
                    onClick={() => onClick(request)}
                    >
                    <path d={ICON} />
                    </svg>
                </Marker>
    });

    if (this.props.requesterMap && this.props.volunteerMap) {
        volunteerMarkers.push(...requesterMarkers);
        return volunteerMarkers;
    } else if (this.props.requesterMap) {
        return requesterMarkers;
    } else if (this.props.volunteerMap) {
        return volunteerMarkers;
    }
    return <></>;
  }
}