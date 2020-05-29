import React, { useState } from "react";
import PropTypes from "prop-types";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Toast from "react-bootstrap/Toast";
import { toastTime } from "../constants";

/**
 * Changing location modal
 */

export default function NewLocationSetting(props) {
  const [locationString, setLocationString] = useState("");
  const [showInvalid, setShowInvalid] = useState(false);

  const handleSubmit = (e) => {
    props.locationSubmit(e, locationString).then((res) => {
      setLocationString("");
      if (res === false) {
        setShowInvalid(true);
      } else {
        props.hideModal();
      }
    });
  };

  return (
    <Modal
      dialogClassName="location-set-modal"
      show={props.showModal}
      style={{ marginTop: 60 }}
      onHide={() => {
        props.hideModal();
        setShowInvalid(false);
      }}
    >
      <Modal.Header>
        <Modal.Title>Change your location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p id="regular-text">Please input desired city or zip code.</p>
        <Form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
          <Row>
            <Col xs={12}>
              <Form.Group controlId="set-location" bssize="large">
                <Form.Control
                  placeholder="City/Zipcode"
                  value={locationString}
                  onChange={(e) => setLocationString(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button style={{ marginTop: 5 }} id="large-button" type="submit">
            Change Location
          </Button>
          <Button
            variant="link"
            id="refresh-location"
            onClick={props.refreshLocation}
          >
            <u>
              Revert to Original Location
              <i
                className="fa fa-refresh"
                style={{ marginLeft: 10 }}
                aria-hidden="true"
              ></i>
            </u>
          </Button>
        </Form>
      </Modal.Body>
      <Toast
        show={showInvalid}
        delay={toastTime}
        onClose={() => setShowInvalid(false)}
        autohide
        id="toastError"
        style={{ marginBottom: -50, marginRight: 0 }}
      >
        <Toast.Body>Invalid city/zipcode</Toast.Body>
      </Toast>
    </Modal>
  );
}

NewLocationSetting.propTypes = {
  refreshLocation: PropTypes.func,
  showModal: PropTypes.bool,
  hideModal: PropTypes.func,
  locationSubmit: PropTypes.func,
};
