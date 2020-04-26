import React, {PureComponent} from 'react';
import { Marker, FlyToInterpolator} from 'react-map-gl';

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const SIZE = 15;

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
                    <svg height={SIZE} viewBox="0 0 24 24" onClick={() => (this.props.public) ? {} : onClick(request)}
                        style={{
                            cursor: 'pointer',
                            fill: '#2670FF',
                            stroke: 'none',
                            transform: `translate(${-SIZE / 2}px,${-SIZE}px)`
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