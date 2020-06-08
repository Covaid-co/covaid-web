import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function NewDetails(props) {
  return (
    <>
      <h5 id="regular-text-bold" style={{ marginTop: "24px", marginBottom: 0 }}>
        {props.translations[props.language].DetailsAboutRequest}
      </h5>
      <p style={{ fontSize: 14, marginBottom: 0 }} id="regular-text">
        {props.translations[props.language].ComfortableSharingDetails}
      </p>
      <Row>
        <Col xs={12}>
          <Form.Group controlId="details">
            <Form.Control
              as="textarea"
              rows="4"
              placeholder={props.translations[props.language].DetailExample}
              value={props.fields.details}
              onChange={props.handleFieldChange}
              style={{ fontSize: 14 }}
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );
}
