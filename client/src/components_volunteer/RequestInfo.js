/**
 * Request information for a volunteer-tied request
 */

import React, { useState, useEffect } from "react";
import fetch_a from "../util/fetch_auth";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import VolunteerActionConfirmationModal from "./VolunteerActionConfirmationModal";
import { request_status, volunteer_status } from "../constants";

export default function RequestInfo(props) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [title, setTitle] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [action, setAction] = useState("");
  const [buttonColor, setButtonColor] = useState("");
  const [mapURL, setMapURL] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Show reject confirmation modal
  const showReject = () => {
    setShowConfirmationModal(true);
    props.setModalOpen(false);
    setTitle("Confirmation");
    setConfirmation("Are you sure you want to reject this request?");
    setAction("reject");
    setButtonColor("#DB4B4B");
  };

  // Show accept confirmation modal
  const showComplete = () => {
    setShowConfirmationModal(true);
    props.setModalOpen(false);
    setTitle("Confirmation");
    setConfirmation("Confirm that you've completed this request.");
    setAction("complete");
    setButtonColor("#28a745");
  };

  useEffect(() => {
    // Generate map url given lat and long
    var tempURL = "https://www.google.com/maps/@";
    if (props.currRequest.location_info) {
      tempURL += props.currRequest.location_info.coordinates[1] + ",";
      tempURL += props.currRequest.location_info.coordinates[0] + ",15z";
      setLoaded(true);
    }
    setMapURL(tempURL);
  }, [props.currRequest, props.volunteerSpecificInfo]);

  if (!loaded) {
    return <></>;
  }

  // Callback to request rejection
  const reject = () => {
    props.setModalOpen(false);
    props.rejectRequest();
  };

  // Update request to In Progress on backend, callback to request accept
  const accept = () => {
    var url = "/api/request/acceptRequest?";
    let params = {
      ID: props.currRequest._id,
    };
    let query = Object.keys(params)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");
    url += query;
    fetch_a("token", url, {
      method: "put",
    })
      .then((response) => {
        if (response.ok) {
          props.setModalOpen(false);
          props.acceptRequest();
        } else {
          console.log("Error");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Callback to request complete
  const complete = () => {
    props.setModalOpen(false);
    props.completeARequest();
  };

  // Render specific elements in modal, depending on view mode (pending, in_progress, complete)
  var header = <></>;
  var contactInfo = (
    <>
      <h5 id="regular-text-bold" style={{ marginBottom: 3, marginTop: 0 }}>
        Who:
      </h5>
      <p id="regular-text-nomargin">
        {" "}
        {props.currRequest.personal_info.requester_name}
      </p>
      <h5 id="regular-text-bold" style={{ marginBottom: 3, marginTop: 16 }}>
        Contact:
      </h5>
      <p id="regular-text-nomargin">
        {props.currRequest.personal_info.requester_email}{" "}
        {props.currRequest.personal_info.requester_phone}
      </p>
    </>
  );
  var timeSpecific = (
    <>
      <h5 id="regular-text-bold" style={{ marginBottom: 3, marginTop: 16 }}>
        Needed by:
      </h5>
      <p id="regular-text-nomargin">
        {props.currRequest.request_info.time} of{" "}
        {props.currRequest.request_info.date}
      </p>
      <h5 id="regular-text-bold" style={{ marginBottom: 3, marginTop: 16 }}>
        Location:
      </h5>
      <p id="regular-text-bold">
        <a target="_blank" rel="noopener noreferrer" href={mapURL}>
          Click here
        </a>
      </p>
    </>
  );
  var buttons = <></>;
  if (props.modalMode === volunteer_status.PENDING) {
    header = <Modal.Title>New pending request</Modal.Title>;
    contactInfo = <></>;
    buttons = (
      <Row style={{ marginTop: 15 }}>
        <Col xs={6} style={{ padding: 0, paddingLeft: 15, paddingRight: 4 }}>
          <Button
            onClick={showReject}
            id="large-button-empty"
            style={{ borderColor: "#DB4B4B", color: "#DB4B4B" }}
          >
            Reject this request
          </Button>
        </Col>
        <Col xs={6} style={{ padding: 0, paddingLeft: 4, paddingRight: 15 }}>
          <Button
            onClick={accept}
            id="large-button-empty"
            style={{ borderColor: "#28a745", color: "#28a745" }}
          >
            Accept this request
          </Button>
        </Col>
      </Row>
    );
  } else if (props.modalMode === volunteer_status.IN_PROGRESS) {
    header = <Modal.Title>Request is in-progress</Modal.Title>;
    buttons = (
      <Row style={{ marginTop: 15 }}>
        <Col xs={6} style={{ padding: 0, paddingLeft: 15, paddingRight: 4 }}>
          <Button
            onClick={showReject}
            id="large-button-empty"
            style={{ borderColor: "#DB4B4B", color: "#DB4B4B" }}
          >
            Cancel this request
          </Button>
        </Col>
        <Col xs={6} style={{ padding: 0, paddingLeft: 4, paddingRight: 15 }}>
          <Button
            onClick={showComplete}
            id="large-button-empty"
            style={{ borderColor: "#28a745", color: "#28a745" }}
          >
            Complete this request
          </Button>
        </Col>
      </Row>
    );
  } else if (props.modalMode === volunteer_status.COMPLETE) {
    header = <Modal.Title>Completed request</Modal.Title>;
    timeSpecific = <></>;
  }

  // If there are messages from an admin, include those in pending/in_progress requests
  const adminDetails = () => {
    if (
      (props.modalMode === volunteer_status.IN_PROGRESS ||
        props.modalMode === volunteer_status.PENDING) &&
      props.volunteerSpecificInfo.adminMessage &&
      props.volunteerSpecificInfo.adminMessage.length > 0
    ) {
      return (
        <>
          <h5 id="regular-text-bold" style={{ marginBottom: 3, marginTop: 16 }}>
            Message from your mutual aid group:
          </h5>
          <p id="regular-text-nomargin">
            "{props.volunteerSpecificInfo.adminMessage}"
          </p>
        </>
      );
    } else return <></>;
  };

  // Add Alerts to indicate what next steps in request workflow are
  const requestWarnings = () => {
    if (props.modalMode === volunteer_status.PENDING) {
      return (
        <Alert style={{ marginBottom: 20 }} variant={"secondary"}>
          Thanks for volunteering in your community! You can choose to accept
          the request below or decline it if you are no longer able to help.
        </Alert>
      );
    } else if (props.modalMode === volunteer_status.IN_PROGRESS) {
      return (
        <Alert style={{ marginBottom: 20 }} variant={"warning"}>
          Thanks for accepting this request for support! Please reach out to the
          requester by using the contact information below.
        </Alert>
      );
    }
  };

  return (
    <>
      <Modal
        show={props.modalOpen}
        onHide={props.closeModal}
        style={{ marginTop: 10, paddingBottom: 50 }}
      >
        <Modal.Header closeButton>{header}</Modal.Header>
        <Modal.Body>
          {requestWarnings()}
          {contactInfo}
          <h5
            id="regular-text-bold"
            style={{
              marginBottom: 3,
              marginTop: props.modalMode === volunteer_status.PENDING ? 0 : 16,
            }}
          >
            Details:
          </h5>
          <p id="regular-text-nomargin">
            {" "}
            {props.currRequest.request_info.details}
          </p>
          {adminDetails()}
          <h5 id="regular-text-bold" style={{ marginBottom: 3, marginTop: 16 }}>
            Requesting support with:
          </h5>
          {props.currRequest.request_info.resource_request ? (
            props.currRequest.request_info.resource_request.map((task, i) => {
              return (
                <Badge key={i} id="task-info">
                  {task}
                </Badge>
              );
            })
          ) : (
            <></>
          )}

          {timeSpecific}
          {buttons}
        </Modal.Body>
      </Modal>
      <VolunteerActionConfirmationModal
        showModal={showConfirmationModal}
        setShowConfirmationModal={setShowConfirmationModal}
        confirmation={confirmation}
        title={title}
        setOriginalModal={props.setModalOpen}
        action={action}
        complete={complete}
        reject={reject}
        buttonColor={buttonColor}
        currRequest={props.currRequest}
      />
    </>
  );
}
