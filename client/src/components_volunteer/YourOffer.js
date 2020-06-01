/**
 * Volunteer's Your Offer component
 */

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useFormFields } from "../libs/hooksLib";
import fetch_a from "../util/fetch_auth";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";
import Alert from "react-bootstrap/Alert";
import Details from "../components_homepage/Details";
import NewCar from "../components_homepage/NewHasCar";

import { generateURL, extractTrueObj } from "../Helpers";
import { defaultResources, toastTime } from "../constants";
import CheckForm from "../components/CheckForm";

export default function YourOffer(props) {
  const [fields, handleFieldChange] = useFormFields({ details: "" });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [availability, setAvailability] = useState(false);
  const [resources, setResources] = useState({});
  const [isActive, setIsActive] = useState(false);
  const [isUnPublish, setIsUnPublish] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasCar, setHasCar] = useState(false);

  // Helper function to update list state elements
  const setCurrentUserObject = (userList, fullList, setFunction) => {
    for (var i = 0; i < fullList.length; i++) {
      const curr = fullList[i];
      const include = userList.includes(curr) ? true : false;
      setFunction((prev) => ({
        ...prev,
        [curr]: include,
      }));
    }
  };

  useEffect(() => {
    // Fill in existing user info to state
    fields.details = props.user.offer.details;
    setAvailability(props.user.availability);
    setHasCar(props.user.offer.car);
    getResources();
  }, [props.user]);

  async function getResources() {
    if (!props.user.association) {
      setCurrentUserObject(
        props.user.offer.tasks,
        defaultResources,
        setResources
      );
      return;
    }
    let params = { associationID: props.user.association };
    var url = generateURL("/api/association/get_assoc/?", params);
    const response = await fetch(url);
    response.json().then((data) => {
      setCurrentUserObject(
        props.user.offer.tasks,
        data.resources,
        setResources
      );
    });
  }
  // Update the state of offer, allow a 750 ms loading time
  function stateChange(setter, publish) {
    setAvailability(publish);
    setter(false);
  }

  const handleBackButton = async () => {
    getResources();
    setHasCar(props.user.offer.car);
    fields.details = props.user.offer.details;
    setIsEditing(false);
  };

  // Input validation
  const checkInputs = () => {
    if (Object.values(resources).every((v) => v === false)) {
      setShowToast(true);
      setToastMessage("No task selected");
      return false;
    }

    if (fields.details === "") {
      setShowToast(true);
      setToastMessage("No details written");
      return false;
    }
    return true;
  };

  // PUT offer changes to backend, update state
  // publish -> T/F (whether to publish or unpublish offer)
  // setter -> State setting function that allows for loading effect
  const handleUpdate = (publish, setter) => {
    if (checkInputs() === false) {
      return;
    }

    // Start Loading
    setter(true);
    var resourceList = extractTrueObj(resources);
    let form = {
      "offer.tasks": resourceList,
      "offer.car": hasCar,
      "offer.details": fields.details,
      availability: publish,
    };
    fetch_a("token", "/api/users/update", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok) {
          setIsEditing(false);
          stateChange(setter, publish);
          // Change the state to refect offer update
          response.json().then((user) => {
            props.setUser(user);
          });
        } else {
          console.log("Update not successful");
        }
      })
      .catch((e) => {
        console.log("Error");
      });
  };

  var visibleText = <></>;
  var publishButton = <></>;
  var headerOrBack = <></>;
  var offerForm = <></>;
  var updateText = "Save";
  var editText = "Edit";
  var publishText = "Activate";
  var unpublishText = "Deactivate";
  var spinnerComponent = <Spinner animation="border" />;
  const saveOfferButton = (
    <Button
      id="offer-save-button"
      style={{ marginTop: 20 }}
      onClick={() => {
        handleUpdate(true, setIsUpdate);
      }}
    >
      {isUpdate ? spinnerComponent : updateText}
    </Button>
  );
  const editOfferButton = (
    <Button
      id="offer-edit-button"
      style={{
        marginTop: 12,
        opacity: availability ? 1 : 0.4,
      }}
      disabled={!availability}
      onClick={() => {
        setIsEditing(true);
      }}
    >
      {editText}
    </Button>
  );

  var statusChangeDescription = <></>;

  if (availability) {
    statusChangeDescription = (
      <p id="status-change-description" style={{ color: "#7f7f7f" }}>
        Having a busy day? By marking yourself as inactive, you will be
        prevented from receiving any new request matches until you reactivate
        your offer.
      </p>
    );
    // Render specific text if user is available
    visibleText = (
      <h5
        id="#your-offer-header-detail"
        style={{ fontWeight: "600", color: "#2670FF" }}
      >
        You are an active volunteer
      </h5>
    );
    publishButton = (
      <Button
        id="large-inactivate-button"
        onClick={() => handleUpdate(false, setIsUnPublish)}
      >
        {isUnPublish ? spinnerComponent : unpublishText}
      </Button>
    );
  } else {
    statusChangeDescription = (
      <p id="status-change-description" style={{ color: "#7f7f7f" }}>
        Ready to support your community? Mark yourself as active to begin
        receiving match requests!
      </p>
    );

    // Render specific test is user is unavailable
    visibleText = (
      <h5
        id="your-offer-header-detail"
        style={{ fontWeight: "600", color: "#EB5757" }}
      >
        You are an inactive volunteer
      </h5>
    );
    publishButton = (
      <Button
        id="large-activate-button"
        onClick={() => {
          handleUpdate(true, setIsActive);
        }}
      >
        {isActive ? spinnerComponent : publishText}
      </Button>
    );
  }

  if (isEditing) {
    headerOrBack = (
      <Button
        id="back-button"
        style={{
          marginTop: 4,
          marginBottom: 12,
        }}
        onClick={() => {
          handleBackButton();
        }}
      >
        ←
      </Button>
    );
    offerForm = (
      <Form onSubmit={handleUpdate} style={{ textAlign: "left" }}>
        <h5
          id="regular-text-bold"
          style={{
            color: "#4F4F4F",
            marginBottom: 8,
          }}
        >
          What can you help with?
        </h5>
        <CheckForm obj={resources} setObj={setResources} />
        <h5
          id="regular-text-bold"
          style={{
            color: "#4F4F4F",
            marginTop: 16,
          }}
        >
          Can you drive?
        </h5>
        <NewCar hasCar={hasCar} setHasCar={setHasCar} />
        <Details
          fields={fields.details}
          setLanguage={props.setLanguage}
          language={props.language}
          handleFieldChange={handleFieldChange}
        />
        {saveOfferButton}
      </Form>
    );
  } else {
    headerOrBack = (
      <h3
        id="your-offer-header-detail"
        style={{
          color: "#4F4F4F",
          opacity: availability ? 1 : 0.4,
          marginTop: 4,
          marginBottom: 12,
        }}
      >
        Details
      </h3>
    );
    offerForm = (
      <div>
        <h5
          id="regular-text-bold"
          style={{
            color: "#4F4F4F",
            opacity: availability ? 1 : 0.4,
            marginBottom: 5,
          }}
        >
          What can you help with?
        </h5>
        <p
          id="#offer-detail-response"
          style={{ opacity: availability ? 1 : 0.4, color: "#7F7F7F" }}
        >
          {Object.keys(resources)
            .filter(function (id) {
              return resources[id];
            })
            .join(", ")}
        </p>
        <h5
          id="regular-text-bold"
          style={{
            opacity: availability ? 1 : 0.4,
            color: "#4F4F4F",
            marginBottom: 5,
          }}
        >
          Can you drive?
        </h5>
        <p
          id="#offer-detail-response"
          style={{ opacity: availability ? 1 : 0.4, color: "#7F7F7F" }}
        >
          {hasCar ? "Yes" : "No"}
        </p>
        <h5
          id="regular-text-bold"
          style={{
            opacity: availability ? 1 : 0.4,
            color: "#4F4F4F",
            marginBottom: 5,
          }}
        >
          Details?
        </h5>
        <p
          id="#offer-detail-response"
          style={{
            opacity: availability ? 1 : 0.4,
            color: "#7F7F7F",
            fontStyle: "italic",
          }}
        >
          {`"${fields.details}"`}
        </p>
        {editOfferButton}
      </div>
    );
  }

  return (
    <Row>
      <Col>
        <Container style={{ marginLeft: 0, paddingLeft: 0, marginRight: 128 }}>
          {visibleText}
          {statusChangeDescription}
          {publishButton}
        </Container>

        {/* <Alert
          style={{ marginTop: 10, marginBottom: 20, color: "#721c24" }}
          variant={"danger"}
          id="regular-text"
        >
          If you are showing any symptoms or have traveled in the past 2 weeks,
          please refrain from marking yourself as available.
        </Alert> */}
      </Col>
      <Col>
        <Toast
          show={showToast}
          delay={toastTime}
          onClose={() => setShowToast(false)}
          autohide
          id="toastError"
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
        {headerOrBack}
        <p
          id="requestCall"
          style={{
            opacity: availability ? 1 : 0.4,
            marginTop: -16,
            marginBottom: 16,
          }}
        >
          &nbsp;
        </p>
        {offerForm}
      </Col>
    </Row>
  );
}
