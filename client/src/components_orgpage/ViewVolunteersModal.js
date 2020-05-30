import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import { calcDistance } from "../Helpers";
import { generateURL } from "../Helpers";
import { volunteer_status } from "../constants";
import { Badge } from "react-bootstrap";

/**
 * View Volunteers Modal
 */

export default function ViewVolunteersModal(props) {
  const [volunteers, setVolunteers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const ids = props.volunteers
      .map((volunteer) => volunteer.volunteer)
      .join(",");
    if (ids.length > 0) {
      let params = { ids: ids };
      var url = generateURL("/api/users/userIDs?", params);
      fetch(url, {
        method: "get",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((volunteers) => {
              setVolunteers(volunteers);
              setIsLoaded(true);
            });
          }
        })
        .catch((e) => {
          alert(e);
        });
    }
  }, [props.volunteers]);

  const handleVolunteerClick = (volunteer) => {
    // setCurrVolunteer({...volunteer});
    console.log(volunteer);
  };

  const distance = (volunteer) => {
    const latA = volunteer.latlong[1];
    const longA = volunteer.latlong[0];
    const latB = props.currRequest.location_info.coordinates[1];
    const longB = props.currRequest.location_info.coordinates[0];
    const meters = calcDistance(latA, longA, latB, longB);
    const miles = meters * 0.00062137;
    return Math.round(miles * 100) / 100;
  };

  if (!isLoaded) {
    return <></>;
  }

  const displayBadge = (mode) => {
    switch (mode) {
      case volunteer_status.IN_PROGRESS:
        return (
          <Badge className="in-progress-task" style={{ marginTop: 6 }}>
            In Progress
          </Badge>
        );
      case volunteer_status.PENDING:
        return (
          <Badge className="pending-task" style={{ marginTop: 6 }}>
            Pending
          </Badge>
        );
      default:
        return <></>;
    }
  };

  return (
    <Modal
      show={props.showVolunteers}
      onHide={() => props.setShowVolunteers(false)}
      style={{ marginTop: 5, paddingBottom: 40 }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Volunteers {displayBadge(props.mode)}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ zoom: "90%" }}>
        <Row style={{ marginTop: 0 }}>
          <Col xs="12" id="col-scroll">
            <ListGroup variant="flush">
              {volunteers.map((volunteer, i) => {
                if (volunteer.availability) {
                  return (
                    <ListGroup.Item
                      key={i}
                      action
                      onClick={() => handleVolunteerClick(volunteer)}
                    >
                      <div>
                        <h5 id="volunteer-name" style={{ marginBottom: 0 }}>
                          {volunteer.first_name} {volunteer.last_name}
                        </h5>
                      </div>
                      <div>
                        <p id="volunteer-location">
                          {volunteer.offer.neighborhoods.join(", ")}
                        </p>
                        <p
                          id="volunteer-location"
                          style={{
                            float: "right",
                            marginTop: -25,
                            marginRight: 10,
                          }}
                        >
                          {distance(volunteer)} miles
                        </p>
                      </div>
                    </ListGroup.Item>
                  );
                }
              })}
            </ListGroup>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
