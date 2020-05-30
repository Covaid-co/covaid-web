import React from "react";
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";
import LocalizedStrings from "react-localization";
import { translations } from "../translations/translations";

let translatedStrings = new LocalizedStrings({ translations });

export default function Details(props) {
  return (
    <Form.Group
      controlId="details"
      bssize="large"
      style={{ marginBottom: 0, marginTop: 30 }}
    >
      <h5 id="regular-text-bold" style={{ marginBottom: 5 }}>
        {translatedStrings[props.language].Details}
      </h5>
      <p style={{ fontSize: 14 }} id="regular-text">
        {translatedStrings[props.language].Details_Text}
      </p>
      <Form.Control
        as="textarea"
        rows="3"
        value={props.fields}
        onChange={props.handleFieldChange}
        placeholder={translatedStrings[props.language].Details_Example}
      />
    </Form.Group>
  );
}

Details.propTypes = {
  language: PropTypes.string,
  fields: PropTypes.string,
  handleFieldChange: PropTypes.func,
};
