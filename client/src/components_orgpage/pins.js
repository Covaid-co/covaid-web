import React, {PureComponent} from 'react';
import { Marker, FlyToInterpolator} from 'react-map-gl';
import { MARKER_SIZE, ICON } from '../constants'

// Important for perf: the markers never change, avoid rerender when the map viewport changes
export default class Pins extends PureComponent {
  render() {
    const {onClick, mode} = this.props;

    if (this.props.public) {
        return this.props.clusters.map((cluster, index) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const { cluster: isCluster, point_count: pointCount } = cluster.properties;
            
            if (isCluster) {
                return <Marker key={cluster.id} longitude={longitude} latitude={latitude}>
                            <div className="cluster-marker" style={{
                                    width: `${25 + (pointCount / this.props.volunteers.length) * 60}px`,
                                    height: `${25 + (pointCount / this.props.volunteers.length) * 60}px`
                                }}
                                onClick={()=> {
                                    const expansionZoom = Math.min(this.props.supercluster.getClusterExpansionZoom(cluster.id), 12);
                                    this.props.setViewport({
                                        ...this.props.viewport,
                                        latitude,
                                        longitude,
                                        zoom: expansionZoom,
                                        transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
                                        transitionDuration: 'auto'
                                    })
                                }}>
                            </div>
                        </Marker>
            }

            return <Marker key={cluster.properties.id} longitude={longitude} latitude={latitude}>
                    <div className="cluster-marker" style={{width: `0px`,height: `0px`, padding: 5}}
                            onClick={()=> {
                                const expansionZoom = 12;
                                this.props.setViewport({
                                    ...this.props.viewport,
                                    latitude,
                                    longitude,
                                    zoom: expansionZoom,
                                    transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
                                    transitionDuration: 'auto'
                                })
                            }}>
                    </div>
                        {/* <svg height={SIZE} viewBox="0 0 24 24"
                            style={{
                                cursor: 'pointer',
                                fill: '#2670FF',
                                stroke: 'none',
                                transform: `translate(${-SIZE / 2}px,${-SIZE}px)`
                            }}>
                            <path d={ICON}/>
                        </svg> */}
                    </Marker>
        });
    }

    var volunteerMarkers = this.props.volunteers.map((request, index) => {
        return <Marker key={`volunteer-${index}`} longitude={request.longitude} latitude={request.latitude}>
                    <svg height={MARKER_SIZE} viewBox="0 0 24 24" onClick={() => (this.props.public) ? {} : onClick(request)}
                        style={{
                            cursor: 'pointer',
                            fill: '#2670FF',
                            stroke: 'none',
                            transform: `translate(${-MARKER_SIZE / 2}px,${-MARKER_SIZE}px)`
                        }}>
                        <path d={ICON}/>
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
                    height={MARKER_SIZE}
                    viewBox="0 0 24 24"
                    style={{
                        cursor: 'pointer',
                        fill: request.volunteer_status === 'pending' ? '#8A8A8A': color,
                        stroke: 'none',
                        transform: `translate(${-MARKER_SIZE / 2}px,${-MARKER_SIZE}px)`
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