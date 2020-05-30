import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";

/**
 * If we can carry translated string from homepage.js, we can ignore this part and add props for all translatedStrings
 */
import LocalizedStrings from "react-localization";
import { translations } from "../translations/translations";

let translatedStrings = new LocalizedStrings({ translations });

export default function Details(props) {
  const [language, setLanguage] = useState("en");
  useEffect(() => {
    if (props.switchToLanguage === "Español") {
      setLanguage("es");
    } else {
      setLanguage("en");
    }
  }, [props.switchToLanguage]);

  return (
    <Form.Group
      controlId="details"
      bssize="large"
      style={{ marginBottom: 0, marginTop: 30 }}
    >
      <h5 id="regular-text-bold" style={{ marginBottom: 5 }}>
        {translatedStrings[language].Details}
      </h5>
      <p style={{ fontSize: 14 }} id="regular-text">
        {translatedStrings[language].Details_Text}
      </p>
      <Form.Control
        as="textarea"
        rows="3"
        value={props.fields}
        onChange={props.handleFieldChange}
        placeholder={translatedStrings[language].Details_Example}
      />
    </Form.Group>
  );
}

Details.propTypes = {
  setSwithToLanguage: PropTypes.func,
  switchToLanguage: PropTypes.string,
};
