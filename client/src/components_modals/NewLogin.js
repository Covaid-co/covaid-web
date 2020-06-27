import React, { useState, useEffect } from "react";
import Cookie from "js-cookie";
import { useFormFields } from "../libs/hooksLib";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import ResetPassword from "./ResetPassword";
import { validateEmail } from "../Helpers";
import { currURL } from "../constants";

/**
 * If we can carry translated string from homepage.js, we can ignore this part and add props for all translatedStrings
 */
import LocalizedStrings from "react-localization";
import { translations } from "../translations/translations";

let translatedStrings = new LocalizedStrings({ translations });

/**
 * Login modal for volunteers
 */

export default function NewLogin(props) {
  const [language, setLanguage] = useState("en");
  const [show_toast, setShowToast] = useState(false);

  useEffect(() => {
    if (props.switchToLanguage === "Español") {
      setLanguage("es");
    } else {
      setLanguage("en");
    }
  }, [props.switchToLanguage]);

  const [mode, setMode] = useState(true);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });

  function validateForm() {
    return validateEmail(fields.email) && fields.password.length > 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let form = {
      user: {
        email: fields.email,
        password: fields.password,
      },
    };
    fetch("/api/users/login/", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          Cookie.set("token", data.user.token);
          props.hideModal();
          window.location.href = currURL + "/volunteerPortal#requests";
        });
      } else {
        if (response.status === 403) {
          alert(
            "Check your email for a verification link prior to logging in."
          );
        } else if (response.status === 401) {
          alert("Incorrect password.");
        }
      }
    });
  };

  const handleSubmitForgot = async (e) => {
    e.preventDefault();
    let form = { email: fields.email };

    fetch("/api/users/emailpasswordresetlink", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error("err");
        }
      })
      .then(() => {
        props.hideModal();
      })
      .catch(() => {
        setShowToast(true);
      });
  };

  if (mode) {
    return (
      <Modal
        size="sm"
        show={props.showModal}
        onHide={props.hideModal}
        style={{ marginTop: 110 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {translatedStrings[language].VolunteerLogin}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xs={12}>
                <Form.Group controlId="email" bssize="large">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={fields.email}
                    onChange={handleFieldChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group controlId="password" bssize="large">
                  <Form.Control
                    placeholder={translatedStrings[language].Password}
                    value={fields.password}
                    onChange={handleFieldChange}
                    type="password"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              style={{ marginTop: 10 }}
              id="large-button"
              disabled={!validateForm()}
              type="submit"
            >
              {translatedStrings[language].Signin}
            </Button>
            <Button
              id="large-button-empty"
              onClick={() => {
                setMode(!mode);
              }}
            >
              Forgot your password?
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  } else {
    return (
      <ResetPassword
        showModal={props.showModal}
        hideModal={() => setMode(!mode)}
        show_toast={show_toast}
        setShowToast={setShowToast}
        handleSubmitForgot={handleSubmitForgot}
        fields={fields}
        handleFieldChange={handleFieldChange}
      />
    );
  }
}
