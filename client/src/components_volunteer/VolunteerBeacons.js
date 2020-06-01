/**
 * Active beacons tied to a volunteer
 */

import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faClock,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import VolunteerBeaconModal from "./VolunteerBeaconModal";

export default function VolunteerBeacons(props) {
  const [beacons, setBeacons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [volunteer, setVolunteer] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBeacon, setSelectedBeacon] = useState({});

  const refetchBeacons = () => {
    props.fetchBeacons();
  };

  useEffect(() => {
    setBeacons(props.beacons.reverse());
    setVolunteer(props.volunteer);
    setLoading(false);
  }, [props.beacons, props.volunteer]);

  // Render the date for when a beacon will expire
  const formatDate = (beacon) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var end = new Date(beacon.beaconEndDate);
    var endString = monthNames[end.getMonth()] + " " + end.getDate();

    return "Respond by " + endString;
  };

  // Render badge depending on whether beacon has been accepted by user
  const accepted = (beacon) => {
    var volunteerData = beacon.volunteers.find((b) => {
      return b.volunteer_id === volunteer._id;
    });
    return volunteerData.response;
  };

  if (loading) {
    return <></>;
  } else {
    // Default text is there are no beacons
    if (beacons.length === 0) {
      return (
        <>
          <p
            id="regular-text"
            style={{ color: "#CECECE", fontWeight: 600, marginTop: 20 }}
          >
            Nothing to share at the moment
          </p>
        </>
      );
    }

    return (
      <>
        <Row>
          <Col xs={12}>
            <ListGroup
              variant="flush"
              style={{ overflowY: "scroll", height: 300 }}
            >
              {beacons.map((beacon, i) => {
                return (
                  <ListGroup.Item
                    key={i}
                    action
                    onClick={() => {
                      setSelectedBeacon({ ...beacon });
                      setModalOpen(true);
                    }}
                    style={{borderTop: "4px solid " + (accepted(beacon) ? '#3ABD24' : "#DB9327")}}
                  >
                    <div>
                      <h5 id="volunteer-name" style={{color: '#4F4F4F'}}>{beacon.beaconName}</h5>
                    </div>
                    <div
                      style={{
                        display: "inline-block",
                        width: "100%",
                        marginTop: 3,
                        fontFamily: "Inter",
                      }}
                    >
                      <p id="regular-text" style={{ fontSize: 16 }}>
                        {formatDate(beacon)}
                      </p>
                      {/* <p style={{ marginBottom: 0, float: 'right' }}>
                        {getBadge(beacon)}
                      </p> */}
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
            <p id="requestCall" style={{ marginTop: -15, marginBottom: 15 }}>
              &nbsp;
            </p>
          </Col>
        </Row>
        <VolunteerBeaconModal
          beacon={selectedBeacon}
          showBeaconModal={modalOpen}
          setModalOpen={setModalOpen}
          volunteer={volunteer}
          refetchBeacons={refetchBeacons}
        />
      </>
    );
  }
}
