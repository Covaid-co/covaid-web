import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import fetch_a from "./util/fetch_auth";

export default function AcceptedRequestInfo(props) {
  const reject = () => {};

  const accept = () => {
    props.setModalOpen(false);
    // window.location.reload(false)
  };

  return (
    <Modal
      show={props.modalOpen}
      onHide={() => {
        props.setModalOpen(false);
      }}
      style={{ marginTop: 40 }}
    >
      <Modal.Header closeButton>
        <Modal.Title>In-progress Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="titleHeadings" style={{ marginBottom: 3, marginTop: 0 }}>
          Details:
        </h5>
        <p id="request-info"> {props.currRequest.details}</p>
        <h5
          className="titleHeadings"
          style={{ marginBottom: 3, marginTop: 16 }}
        >
          Requesting support with:
        </h5>
        {props.currRequest.resource_request ? (
          props.currRequest.resource_request.map((task, i) => {
            return (
              <Badge key={i} className="task-info">
                {task}
              </Badge>
            );
          })
        ) : (
          <></>
        )}
        <h5
          className="titleHeadings"
          style={{ marginBottom: 3, marginTop: 16 }}
        >
          Date created:
        </h5>
        <p id="request-info">
          {props.currRequest.date}
        </p>
        <Row style={{ marginTop: 15 }}>
          <Col xs={6} style={{ padding: 0, paddingLeft: 15 }}>
            <Button
              onClick={reject}
              id="leftCarButtonPressed"
              style={{
                backgroundColor: "#dc3545",
                borderColor: "#dc3545",
                height: 50,
              }}
            >
              Reject this request
            </Button>
          </Col>
          <Col xs={6} style={{ padding: 0, paddingRight: 15 }}>
            <Button
              onClick={accept}
              id="rightCarButtonPressed"
              style={{
                backgroundColor: "#28a745",
                borderColor: "#28a745",
                height: 50,
              }}
            >
              Accept this request
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
