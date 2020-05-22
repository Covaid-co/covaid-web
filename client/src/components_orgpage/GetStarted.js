import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import FormControl from "react-bootstrap/FormControl";
import { useFormFields } from "../libs/hooksLib";
import { toastTime } from "../constants";

export default function GetStarted(props) {
  const [justRegistered, setJustRegistered] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [fields, handleFieldChange] = useFormFields({
    org_name: "",
    org_contact: "",
    org_details: "",
  });

  const validateForm = () => {
    var valid = true;
    if (fields.org_name.length === 0) {
      setToastMessage("Enter your organization name");
      valid = false;
    } else if (fields.org_contact.length === 0) {
      setToastMessage("Enter your contact information");
      valid = false;
    } else if (fields.org_details.length === 10) {
      setToastMessage("Enter any additional details about your organization");
      valid = false;
    }
    if (valid === false) {
      setShowToast(true);
    }
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm() === false) {
      return;
    }

    let form = {
      name: fields.org_name,
      contact: fields.org_contact,
      details: fields.org_details,
    };

    fetch("/api/orgsignup/signup", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Request successfully created");
          setJustRegistered(true);
        } else {
          console.log("Request not successful");
        }
      })
      .catch((e) => {
        console.log("Error");
      });
  };

  if (justRegistered) {
    return (
      <Modal show={props.showModal} onHide={props.hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Thanks for registering!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p id="regular-text">
            We'll be in contact with you shortly about the details of your
            organization portal!
          </p>
        </Modal.Body>
      </Modal>
    );
  }
  return (
    <Modal
      show={props.showModal}
      style={{ marginTop: 10 }}
      onHide={props.hideModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Organization Sign up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p id="regular-text">
          Bring Covaid to your community today! Covaid empowers your
          organization to more easily handle requests for support made by
          neighbors in your community. It also gives your organization the
          ability to assign volunteers to requests with the touch of a few
          buttons.
        </p>
        <p id="regular-text" style={{ fontStyle: "italic", fontWeight: 600 }}>
          Simply fill out this form and we’ll be in contact with you shortly!
        </p>
        <Form
          onSubmit={props.handleHide}
          style={{
            marginTop: 0,
            marginBottom: 10,
            display: "block",
            whiteSpace: "nowrap",
          }}
        >
          <Form.Group controlId="org_name" bssize="large">
            <FormControl
              value={fields.org_name}
              onChange={handleFieldChange}
              placeholder="Organization Name"
              style={{ marginBottom: 5 }}
            />
          </Form.Group>
          <Form.Group controlId="org_contact" bssize="large">
            <FormControl
              value={fields.org_contact}
              onChange={handleFieldChange}
              placeholder="Organization Contact"
              style={{ marginBottom: 5 }}
            />
          </Form.Group>
          <Form.Group controlId="org_details" bssize="large">
            <FormControl
              value={fields.org_details}
              onChange={handleFieldChange}
              as="textarea"
              rows="5"
              placeholder="Details/Additional Info"
            />
          </Form.Group>
          <Button
            type="submit"
            id="large-button"
            style={{ marginTop: 15 }}
            onClick={handleSubmit}
          >
            Get Started
          </Button>
        </Form>
      </Modal.Body>
      <Toast
        show={showToast}
        delay={toastTime}
        onClose={() => setShowToast(false)}
        autohide
        id="toastError"
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </Modal>
  );
}
