import React from "react";
import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { currURL } from "../constants";

/**
 * Text on homepage to show what who this city is supported by
 */

export default function CitySupport(props) {
  const associationText = () => {
    if (!props.currentAssoc || Object.keys(props.currentAssoc).length === 0) {
      return (
        <>
          <p
            style={{
              paddingLeft: 0,
              marginBottom: 0,
              marginLeft: 0,
              fontSize: 16,
            }}
            id="association-name"
          >
            Covaid.co
          </p>
          <br />
          <a
            href={currURL + "/organizationPortal"}
            rel="noopener noreferrer"
            style={{
              paddingLeft: 0,
              marginBottom: 0,
              marginLeft: 0,
              fontSize: 16,
            }}
            id="association-name"
          >
            Bring Covaid to your community
          </a>
        </>
      );
    } else {
      return (
        <a
          href={props.currentAssoc.homepage}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            paddingLeft: 0,
            marginBottom: 0,
            marginLeft: 0,
            fontSize: 16,
          }}
          id="association-name"
        >
          {props.currentAssoc.name}
        </a>
      );
    }
  };

  const citySupportedBy = () => {
    var float = "left";
    return (
      <div style={{ float: float }}>
        <p id="regular-text" style={{ marginBottom: 0 }}>
          This city is supported by:
        </p>
        <div>{associationText()}</div>
      </div>
    );
  };

  return (
    <>
      <Row id="city-support-text-tablet">
        <Col lg={12} md={12}>
          <p id="requestCall" style={{ marginBottom: 15 }}></p>
        </Col>
        <Col md={12} sm={12} style={{ overflow: "hidden" }}>
          {citySupportedBy()}
        </Col>
      </Row>
      <Row id="web-separate">
        <Col lg={4} md={4}>
          <p id="requestCall" style={{ marginBottom: 15 }}></p>
        </Col>
        <Col lg={12} md={12} sm={12} xs={12}>
          {citySupportedBy()}
        </Col>
      </Row>
    </>
  );
}

CitySupport.propTypes = {
  currentAssoc: PropTypes.object,
};
