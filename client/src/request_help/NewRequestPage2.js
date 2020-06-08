import React, { useState, useEffect } from "react";
import { useFormFields } from "../libs/hooksLib";
import PropTypes from "prop-types";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import Alert from "react-bootstrap/Alert";
import Select from "react-select";

import PhoneNumber from "../components/PhoneNumber";
import CheckForm from "../components/CheckForm";
import { toastTime, languages, contact_option } from "../constants";
import { validateEmail, setFalseObj, extractTrueObj } from "../Helpers";

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
  const language_options = languages.map((lang) => {
    return { value: lang, label: lang };
  });
  const [selectedLanguages, setLanguages] = useState({
    selectedOptions: [{ value: "English", label: "English" }],
  });

  useEffect(() => {
    var lang_temp = [];
    if (Object.keys(props.second_page).length !== 0) {
      setPhoneNumber(props.second_page.phone);
      fields.name_request = props.second_page.name;
      fields.email = props.second_page.email;
      setPhoneNumber(props.second_page.phone);
      setOnBehalf(props.second_page.behalf);
      setContact(props.second_page.contact_option);
      for (var i = 0; i < props.second_page.languages.length; i++) {
        const lang = props.second_page.languages[i];
        lang_temp.push({ value: lang, label: lang });
      }
    }
    setLanguages({ selectedOptions: lang_temp });
  }, [props.currentAssoc, props.second_page]);

  const goToSubmit = () => {
    const valid = checkPage();
    if (valid) {
      setShowToast(false);
      const languages = [];
      for (var i = 0; i < selectedLanguages.selectedOptions.length; i++) {
        languages.push(selectedLanguages.selectedOptions[i].value);
      }
      const result = {
        phone: phone_number,
        name: fields.name_request,
        email: fields.email,
        languages: languages,
        behalf: on_behalf,
        contact_option: contact,
      };
      props.setStepNum(4);
      props.setSecondPage(result);
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
    } else if (Object.values(selectedLanguages).every((v) => v === false)) {
      setToastMessage("Please select a language");
      valid = false;
    }
    return valid;
  };

  var agreement = <></>;
  if (
    props.currentAssoc &&
    props.currentAssoc.name === "Baltimore Mutual Aid"
  ) {
    agreement = (
      <>
        <Form.Check
          type="checkbox"
          id="regular-text"
          label="This match program is being organized by private citizens for the 
                                benefit of those in our community. By completing the sign up form to be 
                                matched, you agree to accept all risk and responsibility and further 
                                hold any facilitator associated with Baltimore Mutual Aid Network and/or 
                                Covaid.co harmless. For any additional questions, please contact bmoremutualaid@gmail.com."
          style={{ fontSize: 12, marginTop: 2 }}
        />
      </>
    );
  }

  const handleChangeContact = (event) => {
    event.persist();
    var result = event.target.value;
    setContact(result);
  };

  const handleChangeLanguage = (selectedOptions) => {
    setLanguages({ selectedOptions });
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
            style={{
              fontStyle: "italic",
              marginTop: 0,
              marginBottom: 10,
              fontSize: 14,
            }}
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
          style={{
            display: "table-cell",
            verticalAlign: "middle",
            fontSize: 14,
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
      <h5 id="subtitle-light" style={{ marginTop: 20, marginBottom: 0 }}>
        Best way to reach you
      </h5>
      <Form.Group as={Row} controlId="contact">
        <Col xs={12} style={{ marginTop: 5 }}>
          {contact_option.map((val, i) => {
            return (
              <div style={{ display: "table", marginBottom: 2 }} key={i}>
                <Form.Check
                  checked={contact == i}
                  type="radio"
                  value={i}
                  onChange={handleChangeContact}
                  name="formHorizontalRadios"
                  id={i}
                />
                <p
                  style={{
                    display: "table-cell",
                    verticalAlign: "middle",
                    fontSize: 14,
                    paddingTop: 2,
                  }}
                  id="behalf-text"
                  onClick={() => {
                    setContact(i);
                  }}
                >
                  {contact_option[i]}
                </p>
              </div>
            );
          })}
        </Col>
      </Form.Group>
      <h5 id="subtitle-light" style={{ marginTop: 15, marginBottom: 5 }}>
        {props.translations[props.language].WhatLanguageDoYouSpeak}
      </h5>
      <p id="regular-text" style={{ marginBottom: 5, fontSize: 14 }}>
        {props.translations[props.language].LanguageNotListed}
      </p>
      <Select
        closeMenuOnSelect={true}
        defaultValue={selectedLanguages.selectedOptions}
        isMulti
        options={language_options}
        onChange={handleChangeLanguage}
      />
      {agreement}
      <Button id="large-button" style={{ marginTop: 20 }} onClick={goToSubmit}>
        {props.translations[props.language].SubmitRequest}
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
  second_page: PropTypes.object,
  setSecondPage: PropTypes.func,
  setStepNum: PropTypes.func,
  currentAssoc: PropTypes.object,
};
