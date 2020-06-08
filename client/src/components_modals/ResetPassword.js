import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Toast from "react-bootstrap/Toast";
import { validateEmail } from "../Helpers";
import { toastTime } from "../constants";

/**
 * Reset Password modal
 */

export default function ResetPassword(props) {
  return (
    <Modal
      show={props.showModal}
      size="sm"
      style={{ marginTop: 110 }}
      onHide={props.hideModal}
    >
      <Modal.Header>
        <Modal.Title>Reset your password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={props.handleSubmitForgot}>
          <Row>
            <Col xs={12}>
              <Form.Group controlId="email" bssize="large">
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={props.fields.email}
                  onChange={props.handleFieldChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button
            style={{ marginTop: 10 }}
            id="large-button"
            disabled={!validateEmail(props.fields.email)}
            type="submit"
          >
            Send reset link
          </Button>
          <Button id="large-button-empty" onClick={props.hideModal}>
            Back to login
          </Button>
        </Form>
      </Modal.Body>
      <Toast
        show={props.show_toast}
        style={{ marginBottom: -50 }}
        delay={toastTime}
        onClose={() => props.setShowToast(false)}
        autohide
        id="toastError"
      >
        <Toast.Body>No account found with that email</Toast.Body>
      </Toast>
    </Modal>
  );
}

ResetPassword.propTypes = {
  showModal: PropTypes.bool,
  handleSubmitForgot: PropTypes.func,
  handleFieldChange: PropTypes.func,
  hideModal: PropTypes.func,
  fields: PropTypes.object,
};
