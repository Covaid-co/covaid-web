import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Marker, FlyToInterpolator } from "react-map-gl";
import { MARKER_SIZE, ICON, current_tab } from "../constants";
import { filter_requests, isInProgress } from "./OrganizationHelpers";

// Important for perf: the markers never change, avoid rerender when the map viewport changes
export default class Pins extends PureComponent {
  render() {
    const { onClick, mode } = this.props;

    if (this.props.public) {
      return this.props.clusters.map((cluster, index) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const {
          cluster: isCluster,
          point_count: pointCount,
        } = cluster.properties;

        if (isCluster) {
          return (
            <Marker key={cluster.id} longitude={longitude} latitude={latitude}>
              <div
                className="cluster-marker"
                style={{
                  width: `${
                    25 + (pointCount / this.props.volunteers.length) * 60
                  }px`,
                  height: `${
                    25 + (pointCount / this.props.volunteers.length) * 60
                  }px`,
                }}
                onClick={() => {
                  const expansionZoom = Math.min(
                    this.props.supercluster.getClusterExpansionZoom(cluster.id),
                    12
                  );
                  this.props.setViewport({
                    ...this.props.viewport,
                    latitude,
                    longitude,
                    zoom: expansionZoom,
                    transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
                    transitionDuration: "auto",
                  });
                }}
              ></div>
            </Marker>
          );
        }

        return (
          <Marker
            key={cluster.properties.id}
            longitude={longitude}
            latitude={latitude}
          >
            <div
              className="cluster-marker"
              style={{ width: `0px`, height: `0px`, padding: 5 }}
              onClick={() => {
                const expansionZoom = 12;
                this.props.setViewport({
                  ...this.props.viewport,
                  latitude,
                  longitude,
                  zoom: expansionZoom,
                  transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
                  transitionDuration: "auto",
                });
              }}
            ></div>
          </Marker>
        );
      });
    }

    var volunteerMarkers = this.props.volunteers.map((request, index) => {
      return (
        <Marker
          key={`volunteer-${index}`}
          longitude={request.longitude}
          latitude={request.latitude}
        >
          <svg
            height={MARKER_SIZE}
            viewBox="0 0 24 24"
            onClick={() => (this.props.public ? {} : onClick(request))}
            style={{
              cursor: "pointer",
              fill: "#2670FF",
              stroke: "none",
              transform: `translate(${-MARKER_SIZE / 2}px,${-MARKER_SIZE}px)`,
            }}
          >
            <path d={ICON} />
          </svg>
        </Marker>
      );
    });

    var requests = filter_requests(this.props.allRequests, mode);
    var color = "#DB4B4B";
    if (mode === current_tab.MATCHED) {
      color = "#8A8A8A";
    } else if (mode === current_tab.COMPLETED) {
      color = "#28a745";
    }

    var requesterMarkers = requests.map((request, index) => {
      const lat = request.location_info.coordinates[1];
      const long = request.location_info.coordinates[0];
      if (lat && long) {
        return (
          <Marker key={`requester-${index}`} longitude={long} latitude={lat}>
            <svg
              height={MARKER_SIZE}
              viewBox="0 0 24 24"
              onClick={() => onClick(request)}
              style={{
                cursor: "pointer",
                fill: isInProgress(request) ? "#db9327" : color,
                stroke: "none",
                transform: `translate(${-MARKER_SIZE / 2}px,${-MARKER_SIZE}px)`,
              }}
            >
              <path d={ICON} />
            </svg>
          </Marker>
        );
      } else {
        return <></>;
      }
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

Pins.propTypes = {
  setCurrRequest: PropTypes.func,
  setRequestDetailsModal: PropTypes.func,
  setCurrVolunteer: PropTypes.func,
  setVolunteerDetailsModal: PropTypes.func,
  setInRequest: PropTypes.func,
  volunteers: PropTypes.array,
  requests: PropTypes.array,
  mode: PropTypes.number,
  association: PropTypes.object,
  requesterMap: PropTypes.bool,
  volunteerMap: PropTypes.bool,
  allRequests: PropTypes.array,
  public: PropTypes.bool,
};
