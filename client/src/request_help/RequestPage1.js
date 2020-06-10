import React, { useState, useEffect } from "react";
import { useFormFields } from "../libs/hooksLib";
import PropTypes from "prop-types";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import Alert from "react-bootstrap/Alert";

import PhoneNumber from "../components/PhoneNumber";
import CheckForm from "../components/CheckForm";
import { toastTime, languages } from "../constants";
import { validateEmail, setFalseObj, extractTrueObj } from "../Helpers";

/**
 * Request support (Page 1)
 */

export default function RequestPage1(props) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [languageChecked, setLanguageChecked] = useState({});
  const [on_behalf, setOnBehalf] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    name_request: "",
    email: "",
  });

  useEffect(() => {
    var lang_temp = setFalseObj(languages);
    if (Object.keys(props.first_page).length !== 0) {
      setPhoneNumber(props.first_page.phone);
      fields.name_request = props.first_page.name;
      fields.email = props.first_page.email;
      setPhoneNumber(props.first_page.phone);
      for (var i = 0; i < props.first_page.languages.length; i++) {
        lang_temp[props.first_page.languages[i]] = true;
      }
    }
    setLanguageChecked(lang_temp);
  }, [props.currentAssoc, props.first_page]);

  const goToSecondPage = () => {
    const valid = checkPage();
    if (valid) {
      setShowToast(false);
      const languages = extractTrueObj(languageChecked);
      const result = {
        phone: phone_number,
        name: fields.name_request,
        email: fields.email,
        languages: languages,
        behalf: on_behalf,
      };
      props.setStepNum(3);
      props.setFirstPage(result);
    } else {
      setShowToast(true);
    }
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
    } else if (Object.values(languageChecked).every((v) => v === false)) {
      setToastMessage("Please select a language");
      valid = false;
    }
    return valid;
  };

  return (
    <>
      <h5 id="title-light">
        {props.translations[props.language].personalInformation}
      </h5>
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
          <p
            id="regular-text"
            style={{ fontStyle: "italic", marginTop: 0, fontSize: 14 }}
          >
            {props.translations[props.language].emailOrPhone}.
          </p>
        </Col>
      </Row>
      <div style={{ display: "table", marginBottom: 5 }}>
        <Form.Check
          type="checkbox"
          style={{ marginTop: 0, marginRight: 5, display: "inline" }}
          id="default-checkbox"
          checked={on_behalf}
          onChange={() => {
            setOnBehalf(!on_behalf);
          }}
        />
        <p
          style={{ display: "table-cell", verticalAlign: "middle" }}
          id="behalf-text"
          onClick={() => {
            setOnBehalf(!on_behalf);
          }}
        >
          {props.translations[props.language].OnBehalf}
        </p>
      </div>
      <Alert
        style={{ marginBottom: 20, display: on_behalf ? "block" : "none" }}
        variant={"warning"}
      >
        {props.translations[props.language].BehalfWarning}
      </Alert>
      <h5 id="subtitle-light" style={{ marginTop: 10, marginBottom: 5 }}>
        {props.translations[props.language].WhatLanguageDoYouSpeak}
      </h5>
      <p id="regular-text" style={{ marginBottom: 5 }}>
        {props.translations[props.language].LanguageNotListed}
      </p>
      <CheckForm
        obj={languageChecked}
        setObj={setLanguageChecked}
        translations={props.translations}
        language={props.language}
      />
      <Button
        id="large-button"
        style={{ marginTop: 30 }}
        onClick={goToSecondPage}
      >
        {props.translations[props.language].Next}
      </Button>
      <Toast
        show={showToast}
        delay={toastTime}
        onClose={() => setShowToast(false)}
        autohide
        style={{ marginBottom: 60 }}
        id="toastError"
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </>
  );
}

RequestPage1.propTypes = {
  first_page: PropTypes.object,
  setFirstPage: PropTypes.func,
  setStepNum: PropTypes.func,
  currentAssoc: PropTypes.object,
};
