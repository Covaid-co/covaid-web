import React from "react";
import PropTypes from "prop-types";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";

import { contact_option } from "../constants";

/**
 * Request confirmation page
 */

export default function RequestConfirmation(props) {
  return (
    <Row style={{ marginTop: 20 }}>
      <Col sm={0} md={0} lg={2}></Col>
      <Col sm={12} md={12} lg={8}>
        <h5 id="title-light" style={{ marginBottom: 5 }}>
          {props.second_page.name}
        </h5>
        <p id="regular-text" style={{ marginBottom: 0 }}>
          {props.second_page.email}
        </p>
        <p id="regular-text" style={{ marginBottom: 0 }}>
          {props.second_page.phone}
        </p>
        <div style={{ marginTop: 20 }}>
          <h5
            id="subtitle-light"
            style={{ marginTop: 0, marginBottom: 5, display: "inline" }}
          >
            Best way to Reach:
          </h5>
          <p
            id="regular-text"
            style={{ marginBottom: 5, display: "inline", marginLeft: 5 }}
          >
            {contact_option[props.second_page.contact_option]}
          </p>
        </div>
        <div style={{ marginTop: 10 }}>
          <h5
            id="subtitle-light"
            style={{ marginTop: 0, marginBottom: 5, display: "inline" }}
          >
            Languages:
          </h5>
          <p
            id="regular-text"
            style={{ marginBottom: 5, display: "inline", marginLeft: 5 }}
          >
            {props.second_page.languages.join(", ")}
          </p>
        </div>
        <h5 id="subtitle-light" style={{ marginTop: 10, marginBottom: 5 }}>
          Needs:
        </h5>
        <div>
          {props.first_page.resources.map((task, i) => {
            return (
              <Badge key={i} id="task-info">
                {task}
              </Badge>
            );
          })}
        </div>
        <h5 id="subtitle-light" style={{ marginTop: 15, marginBottom: 0 }}>
          Details:
        </h5>
        <p id="regular-text" style={{ marginBottom: 5 }}>
          {props.first_page.details}
        </p>
        <Button
          id="large-button"
          style={{ marginTop: 20 }}
          onClick={props.submitRequest}
        >
          {props.translations[props.language].SubmitRequest}
        </Button>
      </Col>
    </Row>
  );
}

RequestConfirmation.propTypes = {
  first_page: PropTypes.object,
  submitRequest: PropTypes.func,
  setFirstPage: PropTypes.func,
  setStepNum: PropTypes.func,
  currentAssoc: PropTypes.object,
  setSecondPage: PropTypes.func,
  second_page: PropTypes.object,
};
