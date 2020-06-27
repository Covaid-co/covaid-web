import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";

import { useFormFields } from "../libs/hooksLib";
import { validateEmail, extractTrueObj } from "../Helpers";
import {
  MARKER_SIZE,
  ICON,
  paymentOptions,
  languages,
  defaultResources,
} from "../constants";
import CheckForm from "../components/CheckForm";

import ReactMapGL, { Marker, NavigationControl } from "react-map-gl";

export default function EditRequestInfoModal(props) {
  const [fields, handleFieldChange] = useFormFields({
    name: props.currRequest.personal_info.requester_name,
    email: props.currRequest.personal_info.requester_email,
    phone: props.currRequest.personal_info.requester_phone,
    details: props.currRequest.request_info.details,
  });

  const [formattedPhone, setFormattedPhone] = useState(
    props.currRequest.personal_info.requester_phone
  );

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [viewport, setViewport] = useState({
    latitude: props.currRequest.location_info.coordinates[1],
    longitude: props.currRequest.location_info.coordinates[0],
    zoom: 10,
    bearing: 0,
    pitch: 0,
    width: "100%",
    height: 250,
  });

  const [lat, setLat] = useState(
    props.currRequest.location_info.coordinates[1]
  );
  const [long, setLong] = useState(
    props.currRequest.location_info.coordinates[0]
  );

  const [isLoaded, setIsLoaded] = useState(false);

  const [languageChecked, setLanguageChecked] = useState({});
  const [needsChecked, setNeedsChecked] = useState({});
  const [payment, setPayment] = useState(
    props.currRequest.request_info.payment
  );
  const [time, setTime] = useState(props.currRequest.request_info.time);
  const [date, setDate] = useState(props.currRequest.request_info.date);

  const setCurrentRequestObject = (userList, fullList, setFunction) => {
    for (var i = 0; i < fullList.length; i++) {
      const curr = fullList[i];
      const include = userList.includes(curr) ? true : false;
      setFunction((prev) => ({
        ...prev,
        [curr]: include,
      }));
    }
  };

  const navStyle = {
    position: "absolute",
    top: 36,
    left: 0,
    padding: "10px",
  };

  const handleChangeTime = (event) => {
    event.persist();
    var result = event.target.value;
    setTime(result);
  };
  const handleChangeDate = (event) => {
    event.persist();
    var result = event.target.value;
    setDate(result);
  };

  const handleChangePayment = (event) => {
    event.persist();
    var result = event.target.value;
    setPayment(result);
  };

  const marker = () => {
    return (
      <Marker
        longitude={long}
        latitude={lat}
        draggable={true}
        onDragEnd={(event) => {
          setLong(event.lngLat[0]);
          setLat(event.lngLat[1]);
        }}
      >
        <svg
          height={MARKER_SIZE}
          viewBox="0 0 24 24"
          style={{
            cursor: "pointer",
            fill: "#2670FF",
            stroke: "none",
          }}
        >
          <path d={ICON} />
        </svg>
      </Marker>
    );
  };

  const paymentForm = () => {
    return (
      <fieldset>
        <Form.Group as={Row} controlId="payment">
          <Form.Label column sm={3}>
            <h4 id="regular-text-bold">Payment</h4>
          </Form.Label>
          <Col sm={8} style={{ marginTop: 10 }}>
            <Form.Check
              checked={payment == 0}
              type="radio"
              label={paymentOptions[0]}
              value={0}
              onChange={handleChangePayment}
              name="formHorizontalRadios"
              id="payment-option-0"
            />
            <Form.Check
              checked={payment == 1}
              type="radio"
              label={paymentOptions[1]}
              value={1}
              onChange={handleChangePayment}
              name="formHorizontalRadios"
              id="payment-option-1"
            />
            <Form.Check
              checked={payment == 2}
              type="radio"
              label={paymentOptions[2]}
              value={2}
              onChange={handleChangePayment}
              name="formHorizontalRadios"
              id="payment-option-2"
            />
            <Form.Check
              checked={payment == 3}
              type="radio"
              label={paymentOptions[3]}
              value={3}
              onChange={handleChangePayment}
              name="formHorizontalRadios"
              id="payment-option-3"
            />
          </Col>
        </Form.Group>
      </fieldset>
    );
  };

  const checkInputs = () => {
    var valid = true;
    var strippedPhone = stripPhone(fields.phone);

    if (Object.values(needsChecked).every((v) => v === false)) {
      setToastMessage("Need to select a resource/need");
      valid = false;
    }

    if (Object.values(languageChecked).every((v) => v === false)) {
      setToastMessage("Need to select a language");
      valid = false;
    }

    if (strippedPhone.length !== 10 && fields.phone.length !== 0) {
      setToastMessage("Enter a valid phone number");
      valid = false;
    }

    if (validateEmail(fields.email) === false && fields.email.length !== 0) {
      setToastMessage("Enter a valid email");
      valid = false;
    }

    if (fields.name.length === 0) {
      setToastMessage("Enter a name");
      valid = false;
    }

    if (valid === false) {
      setShowToast(true);
    }
    return valid;
  };

  const stripPhone = (phone) => {
    var strippedNumber = phone.replace(/[^0-9 ]/g, "");
    return strippedNumber;
  };

  const formatPhone = (phone) => {
    if (phone !== undefined && phone.length !== 0) {
      var stripped = stripPhone(phone);
      var formattedPhone =
        "(" +
        stripped.slice(0, 3) +
        ")" +
        "-" +
        stripped.slice(3, 6) +
        "-" +
        stripped.slice(6, 10);
      return formattedPhone;
    }
    return phone;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkInputs() === false) {
      return;
    }

    var selectedLanguages = extractTrueObj(languageChecked);
    var selectedResources = extractTrueObj(needsChecked);

    const requester_id = props.currRequest._id;
    let form = {
      requestID: requester_id,
      updates: {
        $set: {
          "personal_info.requester_name": fields.name,
          "personal_info.requester_phone": formatPhone(fields.phone),
          "personal_info.requester_email": fields.email,
          "request_info.details": fields.details,
          "location_info.coordinates": [long, lat],
          "request_info.time": time,
          "request_info.date": date,
          "personal_info.languages": selectedLanguages,
          "request_info.resource_request": selectedResources,
          "request_info.payment": payment,
        },
      },
    };

    fetch("/api/request/updateRequestDetails", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .then((newRequest) => {
        props.updateRequests(newRequest);
        props.setShowEditModal(false);
        props.setRequestDetailsModal(true);
      })
      .catch((e) => {
        alert(e);
      });
  };

  useEffect(() => {
    setIsLoaded(true);

    fields.name = props.currRequest.personal_info.requester_name;
    fields.email = props.currRequest.personal_info.requester_email;
    fields.phone = props.currRequest.personal_info.requester_phone;
    setCurrentRequestObject(
      props.currRequest.personal_info.languages,
      languages,
      setLanguageChecked
    );
    if (props.association && Object.keys(props.association).length > 0) {
      setCurrentRequestObject(
        props.currRequest.request_info.resource_request,
        props.association.resources,
        setNeedsChecked
      );
    } else {
      setCurrentRequestObject(
        props.currRequest.request_info.resource_request,
        defaultResources,
        setNeedsChecked
      );
    }
  }, [props.currRequest]);

  if (isLoaded) {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Update request information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container
            id="volunteer-info"
            style={{
              maxWidth: 2000,
              marginBottom: 10,
              marginLeft: 0,
              marginRight: 0,
              color: "black",
            }}
          >
            <Row>
              <Col>
                <Form>
                  <Form.Group as={Row} controlId="name">
                    <Form.Label column sm={3}>
                      <h4 id="regular-text-bold">Name</h4>
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        value={fields.name}
                        onChange={handleFieldChange}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="email">
                    <Form.Label column sm={3}>
                      <h4 id="regular-text-bold">Email</h4>
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        value={fields.email}
                        onChange={handleFieldChange}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="phone">
                    <Form.Label column sm={3}>
                      <h4 id="regular-text-bold">Phone</h4>
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        value={fields.phone}
                        onChange={handleFieldChange}
                      />
                    </Col>
                  </Form.Group>
                  {paymentForm()}
                  <Row>
                    <Form.Label column sm={3}>
                      <h4 id="regular-text-bold">Location</h4>
                    </Form.Label>
                    <Col sm={8} style={{ marginTop: 13 }}>
                      <ReactMapGL
                        {...viewport}
                        onViewportChange={setViewport}
                        mapboxApiAccessToken={props.mapboxAccessToken}
                        mapStyle="mapbox://styles/mapbox/light-v9"
                      >
                        <div style={navStyle}>
                          <NavigationControl />
                        </div>
                        {marker()}
                      </ReactMapGL>
                    </Col>
                  </Row>

                  <h4
                    id="regular-text-bold"
                    style={{ marginBottom: 5, marginTop: 20 }}
                  >
                    Languages
                  </h4>
                  <CheckForm
                    obj={languageChecked}
                    setObj={setLanguageChecked}
                  />
                  <h4
                    id="regular-text-bold"
                    style={{ marginBottom: 5, marginTop: 20 }}
                  >
                    Needs
                  </h4>
                  <CheckForm obj={needsChecked} setObj={setNeedsChecked} />

                  <h4
                    id="regular-text-bold"
                    style={{ marginBottom: 5, marginTop: 20 }}
                  >
                    Need By:{" "}
                  </h4>
                  <Row>
                    <Col xs={6} style={{ paddingRight: "4px" }}>
                      <Form.Group controlId="time" onChange={handleChangeTime}>
                        <Form.Control as="select">
                          <option value="Morning"> Morning </option>
                          <option value="Afternoon"> Afternoon </option>
                          <option value="Evening"> Evening </option>
                          <option value="Night"> Night</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col xs={6} style={{ paddingLeft: "4px" }}>
                      <Form.Group controlId="date" bssize="large">
                        <Form.Control as="select" onChange={handleChangeDate}>
                          <option>{date}</option>
                          <option>
                            {
                              new Date(Date.now())
                                .toLocaleString()
                                .split(",")[0]
                            }
                          </option>
                          <option>
                            {
                              new Date(Date.now() + 86400000)
                                .toLocaleString()
                                .split(",")[0]
                            }
                          </option>
                          <option>
                            {
                              new Date(Date.now() + 2 * 86400000)
                                .toLocaleString()
                                .split(",")[0]
                            }
                          </option>
                          <option>
                            {
                              new Date(Date.now() + 3 * 86400000)
                                .toLocaleString()
                                .split(",")[0]
                            }
                          </option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group controlId="details">
                    <Form.Label>
                      {" "}
                      <h4 id="regular-text-bold">Request Details</h4>{" "}
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="5"
                      value={fields.details}
                      onChange={handleFieldChange}
                    />
                  </Form.Group>
                  <Row>
                    <Col xs={12}>
                      <Button
                        onClick={handleSubmit}
                        id="large-button"
                        style={{ marginTop: 20 }}
                      >
                        Update request info
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Toast
          show={showToast}
          delay={1500}
          onClose={() => setShowToast(false)}
          autohide
          id="toastError"
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </>
    );
  } else {
    return <></>;
  }
}
