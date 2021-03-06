import React, { useState, useEffect } from "react";
import { useFormFields } from "../libs/hooksLib";
import PropTypes from "prop-types";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";

import CheckForm from "../components/CheckForm";
import PhoneNumber from "../components/PhoneNumber";
import { toastTime } from "../constants";
import { validateEmail, setTrueObj, extractTrueObj } from "../Helpers";

/**
 * If we can carry translated string from homepage.js, we can ignore this part and add props for all translatedStrings
 */
import LocalizedStrings from "react-localization";
import { translations } from "../translations/translations";

let translatedStrings = new LocalizedStrings({ translations });

/**
 * Volunteer Registration (Page 1)
 */

export default function RegisterPage1(props) {
  const [neighborhoodsChecked, setNeighborhoodsChecked] = useState({});
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [fields, handleFieldChange] = useFormFields({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pronouns: "",
  });

  useEffect(() => {
    setNeighborhoodsChecked(setTrueObj(props.neighborhoods));
  }, [props.neighborhoods]);

  const goToSecondPage = () => {
    const valid = checkPage();
    if (valid) {
      setShowToast(false);
      const selectedNeighborhoods = extractTrueObj(neighborhoodsChecked);
      var phoneString = phoneNumber.replace(/\D/g, "").substring(0, 10);
      const result = {
        first_name: fields.first_name,
        last_name: fields.last_name,
        email: fields.email,
        password: fields.password,
        pronouns: fields.pronouns,
        phone: phoneString,
        neighborhoods: selectedNeighborhoods,
      };
      props.setFirstPage(result);
    } else {
      setShowToast(true);
    }
  };

  const checkPage = () => {
    var valid = true;
    const phoneOnlyDigits = phoneNumber.replace(/\D/g, "").substring(0, 10);
    if (fields.first_name.length === 0) {
      setToastMessage(translatedStrings[props.language].EnterFirstName);
      valid = false;
    } else if (fields.last_name.length === 0) {
      setToastMessage(translatedStrings[props.language].EnterLastName);
      valid = false;
    } else if (phoneOnlyDigits.length !== 10) {
      setToastMessage(translatedStrings[props.language].EnterPhone);
      valid = false;
    } else if (
      fields.email.length === 0 ||
      validateEmail(fields.email) === false
    ) {
      setToastMessage(translatedStrings[props.language].EnterEmail);
      valid = false;
    } else if (fields.password.length === 0) {
      setToastMessage(translatedStrings[props.language].SetPassword);
      valid = false;
    } else if (fields.password !== fields.confirmPassword) {
      setToastMessage(translatedStrings[props.language].PasswordNotSame);
      valid = false;
    } else if (Object.values(neighborhoodsChecked).every((v) => v === false)) {
      setToastMessage(translatedStrings[props.language].NoNeighborhood);
      valid = false;
    }

    if (valid === false) {
      setShowToast(true);
    }
    return valid;
  };

  return (
    <>
      <h5 id="regular-text-bold" style={{ marginTop: 0, marginBottom: 10 }}>
        {translatedStrings[props.language].Locality}
      </h5>
      <p id="regular-text" style={{ marginBottom: 4, fontSize: 14 }}>
        {translatedStrings[props.language].RegisterPage1_Text}
      </p>
      <CheckForm
        obj={neighborhoodsChecked}
        setObj={setNeighborhoodsChecked}
        disabled={true}
      />
      <h5 id="regular-text-bold" style={{ marginTop: 20 }}>
        {translatedStrings[props.language].PersonalInfo}
      </h5>
      <Row>
        <Col xs={6} style={{ paddingRight: "4px" }}>
          <Form.Group controlId="first_name" bssize="large">
            <Form.Control
              value={fields.first}
              onChange={handleFieldChange}
              placeholder={translatedStrings[props.language].FirstName}
            />
          </Form.Group>
        </Col>
        <Col xs={6} style={{ paddingLeft: "4px" }}>
          <Form.Group controlId="last_name" bssize="large">
            <Form.Control
              value={fields.last}
              onChange={handleFieldChange}
              placeholder={translatedStrings[props.language].LastName}
            />
          </Form.Group>
        </Col>
        <Col xs={12}>
          <Form.Group controlId="pronouns" bssize="large">
            <Form.Control
              value={fields.pronouns}
              onChange={handleFieldChange}
              placeholder={translatedStrings[props.language].PreferredPronouns}
            />
          </Form.Group>
        </Col>
        <Col xs={12}>
          <PhoneNumber
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            placeholder={translatedStrings[props.language].Phone}
          />
        </Col>
        <Col xs={12}>
          <Form.Group controlId="email" bssize="large">
            <Form.Control
              value={fields.email}
              onChange={handleFieldChange}
              placeholder={translatedStrings[props.language].Email}
            />
          </Form.Group>
        </Col>
        <Col xs={6} style={{ paddingRight: "4px" }}>
          <Form.Group controlId="password" bssize="large">
            <Form.Control
              placeholder={translatedStrings[props.language].Password}
              value={fields.password}
              onChange={handleFieldChange}
              type="password"
            />
          </Form.Group>
        </Col>
        <Col xs={6} style={{ paddingLeft: "4px" }}>
          <Form.Group controlId="confirmPassword" bssize="large">
            <Form.Control
              type="password"
              placeholder={translatedStrings[props.language].ConfirmPassword}
              onChange={handleFieldChange}
              value={fields.confirmPassword}
            />
          </Form.Group>
        </Col>
      </Row>
      <Button
        style={{ marginTop: 15 }}
        id="large-button-empty"
        onClick={goToSecondPage}
      >
        {translatedStrings[props.language].Next}
      </Button>
      <p id="pagenum-text">{translatedStrings[props.language].Page1of3}</p>
      <Toast
        show={showToast}
        delay={toastTime}
        onClose={() => setShowToast(false)}
        autohide
        id="toastError"
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </>
  );
}

RegisterPage1.propTypes = {
  setFirstPage: PropTypes.func,
  neighborhoods: PropTypes.array,
  setLanguage: PropTypes.func,
  language: PropTypes.string,
};
