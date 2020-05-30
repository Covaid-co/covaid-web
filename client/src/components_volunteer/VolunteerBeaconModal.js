/**
 * Specific beacon modal
 */

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import fetch_a from "../util/fetch_auth";
import { useFormFields } from "../libs/hooksLib";

export default function VolunteerBeaconModal(props) {
  const [loaded, setLoaded] = useState(false);
  const [beacon, setBeacon] = useState({});
  const [currentUserResponse, setCurrentUserResponse] = useState({});
  const [fields, handleFieldChange] = useFormFields({
    message: "",
  });

  useEffect(() => {
    setLoaded(true);
    setBeacon(props.beacon);
    getBeaconResponse(props.beacon, props.volunteer);
  }, [props.beacon, props.volunteer]);

  // Update state to contain user's response to specific beacon
  const getBeaconResponse = (beacon, currVolunteer) => {
    if (beacon.volunteers) {
      var userResponse = beacon.volunteers.filter(function (listVolunteer) {
        return listVolunteer.volunteer_id === currVolunteer._id;
      });
      setCurrentUserResponse(userResponse[0]);
      if (userResponse[0].responseMessage) {
        fields.message = userResponse[0].responseMessage;
      }
    }
  };

  // Update user's response to a beacon on backend, update frontend state
  const updateUserResponse = () => {
    if (currentUserResponse.response) {
      fields.message = "";
    }
    const form = {
      beacon_id: beacon._id,
      updates: {
        response: !currentUserResponse.response, // True or False
        responseMessage: fields.message, // Text response
      },
    };

    fetch_a("token", "/api/beacon/userAction", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok) {
          var currResponse = { ...currentUserResponse };
          currResponse.response = !currentUserResponse.response;
          setCurrentUserResponse(currResponse);
          props.refetchBeacons();
        } else {
          console.log("Error");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Render the date for a beacon's start and end date
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
    var start = new Date(beacon.beaconStartDate);
    var end = new Date(beacon.beaconEndDate);
    var startString = monthNames[start.getMonth()] + " " + start.getDate();
    var join = " - ";
    var endString = monthNames[end.getMonth()] + " " + end.getDate();

    if (startString === endString) {
      return startString;
    } else {
      return startString + join + endString;
    }
  };

  if (!loaded) {
    return <></>;
  }

  return (
    <Modal
      size="md"
      show={props.showBeaconModal}
      onHide={() => props.setModalOpen(false)}
      style={{ marginTop: 10, paddingBottom: 40 }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{beacon.beaconName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <h5 id="volunteer-name">{formatDate(beacon)}</h5>
            <p id="volunteer-location">{beacon.beaconMessage}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5 id="volunteer-name">Your Response</h5>
            <Form.Group controlId="message" bssize="large">
              <Form.Control
                as="textarea"
                rows="3"
                placeholder="Respond with a message (optional)"
                value={fields.message}
                onChange={handleFieldChange}
              />
            </Form.Group>
            <Button
              id={
                !currentUserResponse.response
                  ? "rightCarButton"
                  : "rightCarButtonPressed"
              }
              onClick={updateUserResponse}
            >
              {!currentUserResponse.response ? "I'm in!" : "I'm out!'"}
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
