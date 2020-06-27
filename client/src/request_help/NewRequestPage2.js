import React, { useState, useEffect } from "react";
import { useFormFields } from "../libs/hooksLib";
import PropTypes from "prop-types";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import Alert from "react-bootstrap/Alert";

import PhoneNumber from "../components/PhoneNumber";
import { toastTime, contact_option } from "../constants";
import { validateEmail } from "../Helpers";

/**
 * Request support (Page 2)
 */

export default function RequestPage1(props) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [on_behalf, setOnBehalf] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    name_request: "",
    email: "",
  });
  const [contact, setContact] = useState(0);

  useEffect(() => {
    if (Object.keys(props.second_page).length !== 0) {
      setPhoneNumber(props.second_page.phone);
      fields.name_request = props.second_page.name;
      fields.email = props.second_page.email;
      setPhoneNumber(props.second_page.phone);
      setOnBehalf(props.second_page.behalf);
      setContact(props.second_page.contact_option);
    }
  }, [props.currentAssoc, props.second_page]);

  const goToSubmit = () => {
    const valid = checkPage();
    if (valid) {
      const e = { preventDefault: () => {}, stopPropagation: () => {} };
      props.onLocationSubmit(e, props.locationString).then((res) => {
        if (res === false) {
          setToastMessage("Invalid Zip Code/City");
          setShowToast(true);
        } else {
          setShowToast(false);
          const result = {
            phone: phone_number,
            name: fields.name_request,
            email: fields.email,
            behalf: on_behalf,
            contact_option: contact,
          };
          props.setStepNum(1);
          props.setSecondPage(result);
        }
      });
    } else {
      setShowToast(true);
    }
  };

  const handleSubmit = (e) => {
    props.onLocationSubmit(e, props.locationString).then((res) => {
      if (res === false) {
        setToastMessage("Invalid Zip Code/City");
        setShowToast(true);
      }
    });
  };

  const checkPage = () => {
    var valid = true;
    const phoneOnlyDigits = phone_number.replace(/\D/g, "").substring(0, 10);
    if (fields.name_request.length === 0) {
      setToastMessage("Please enter a name");
      valid = false;
    } else if (phoneOnlyDigits.length === 0 && fields.email.length === 0) {
      setToastMessage("Please enter contact information");
      valid = false;
    } else if (
      phoneOnlyDigits.length !== 0 &&
      phoneOnlyDigits.length !== 10 &&
      validateEmail(fields.email) === false
    ) {
      setToastMessage("Please enter valid contact information");
      valid = false;
    } else if (props.locationString === "") {
      setToastMessage("Please enter a location");
      valid = false;
    }
    return valid;
  };

  // var agreement = <></>;
  // if (
  //   props.currentAssoc &&
  //   props.currentAssoc.name === "Baltimore Mutual Aid"
  // ) {
  //   agreement = (
  //     <>
  //       <Form.Check
  //         type="checkbox"
  //         id="regular-text"
  //         label="This match program is being organized by private citizens for the
  //                               benefit of those in our community. By completing the sign up form to be
  //                               matched, you agree to accept all risk and responsibility and further
  //                               hold any facilitator associated with Baltimore Mutual Aid Network and/or
  //                               Covaid.co harmless. For any additional questions, please contact bmoremutualaid@gmail.com."
  //         style={{ fontSize: 12, marginTop: 2 }}
  //       />
  //     </>
  //   );
  // }

  const handleChangeContact = (event) => {
    event.persist();
    var result = event.target.value;
    setContact(contact_option.indexOf(result));
  };

  return (
    <>
      <h5 id="title-light" style={{ marginBottom: 5 }}>
        {props.translations[props.language].personalInformation}
      </h5>
      <p
        id="regular-text"
        style={{
          fontStyle: "italic",
          marginTop: 0,
          marginBottom: 5,
          fontSize: 14,
        }}
      >
        {props.translations[props.language].emailOrPhone}
      </p>
      <div style={{ display: "table", marginBottom: 5 }}>
        <Form.Check
          type="checkbox"
          style={{ marginTop: 0, marginRight: 0, display: "inline" }}
          id="default-checkbox"
          checked={on_behalf}
          onChange={() => {
            setOnBehalf(!on_behalf);
          }}
        />
        <p
          style={{
            paddingTop: 0,
          }}
          id="behalf-text"
          onClick={() => {
            setOnBehalf(!on_behalf);
          }}
        >
          {props.translations[props.language].OnBehalf}
        </p>
      </div>
      <Alert
        style={{
          marginBottom: 20,
          display: on_behalf ? "block" : "none",
          fontSize: 14,
        }}
        variant={"warning"}
      >
        {props.translations[props.language].BehalfWarning}
      </Alert>
      <Row>
        <Col xs={12}>
          <Form.Group controlId="name_request" bssize="large">
            <Form.Control
              value={fields.name_request}
              onChange={handleFieldChange}
              placeholder={props.translations[props.language].name}
            />
          </Form.Group>
        </Col>
        <Col xs={12}>
          <PhoneNumber
            phoneNumber={phone_number}
            setPhoneNumber={setPhoneNumber}
            placeholder={props.translations[props.language].phone}
          />
        </Col>
        <Col xs={12}>
          <Form.Group controlId="email" bssize="large">
            <Form.Control
              value={fields.email}
              onChange={handleFieldChange}
              placeholder={props.translations[props.language].email}
            />
          </Form.Group>
        </Col>
      </Row>
      <h5 id="subtitle-light" style={{ marginTop: 15, marginBottom: 5 }}>
        {props.translations[props.language].BestWay}
      </h5>
      <Form.Group controlId="tracking">
        <Form.Control
          as="select"
          style={{ fontSize: 15, height: 38 }}
          value={contact_option[contact]}
          onChange={handleChangeContact}
        >
          {contact_option.map((val, i) => {
            return (
              <option key={i} style={{ textIndent: 10 }}>
                {val}
              </option>
            );
          })}
        </Form.Control>
      </Form.Group>
      <h5 id="subtitle-light" style={{ marginTop: 15, marginBottom: 5 }}>
        {props.translations[props.language].YourLocation}
      </h5>
      <p
        id="regular-text"
        style={{
          fontStyle: "italic",
          marginTop: 0,
          marginBottom: 5,
          fontSize: 14,
        }}
      >
        {props.translations[props.language].AskLocation}
      </p>
      <Form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
        <InputGroup id="set-location" bssize="large">
          <Form.Control
            placeholder="City/Zipcode"
            value={props.locationString}
            onChange={(e) => props.setLocationString(e.target.value)}
          />
          <InputGroup.Append>
            <Button
              variant="outline-secondary"
              id="location-change-button"
              onClick={handleSubmit}
            >
              {props.translations[props.language].SetLocationShort}
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>
      <Button id="large-button" style={{ marginTop: 20 }} onClick={goToSubmit}>
        {props.translations[props.language].Next}
      </Button>
      <Toast
        show={showToast}
        delay={toastTime}
        onClose={() => setShowToast(false)}
        autohide
        style={{ marginBottom: 80, marginRight: 15 }}
        id="toastError"
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </>
  );
}

RequestPage1.propTypes = {
  second_page: PropTypes.object,
  setSecondPage: PropTypes.func,
  setStepNum: PropTypes.func,
  setLocationString: PropTypes.func,
  locationString: PropTypes.string,
  onLocationSubmit: PropTypes.func,
  currentAssoc: PropTypes.object,
};
