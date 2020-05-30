import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";

/**
 * If we can carry translated string from homepage.js, we can ignore this part and add props for all translatedStrings
 */
import LocalizedStrings from "react-localization";
import { translations } from "../translations/translations";

let translatedStrings = new LocalizedStrings({ translations });

export default function HelpOrganization(props) {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (props.switchToLanguage === "Español") {
      setLanguage("es");
    } else {
      setLanguage("en");
    }
  }, [props.switchToLanguage]);

  const assocName = (assoc) => {
    if (assoc) {
      if (Object.keys(assoc).length === 0) {
        return "Covaid";
      } else {
        return assoc.name;
      }
    }
    return "Covaid";
  };

  const displayRecruiting = (assoc) => {
    if (assoc) {
      if (Object.keys(assoc).length === 0) {
        return false;
      } else {
        return assoc.recruiting;
      }
    }
    return false;
  };

  if (!displayRecruiting(props.currentAssoc)) {
    return <></>;
  }

  return (
    <Form.Group
      controlId="helpDetails"
      bssize="large"
      style={{ marginBottom: 20, marginTop: 0 }}
    >
      <h5 id="regular-text-bold" style={{ marginTop: 0, marginBottom: 5 }}>
        {translatedStrings[language].CanYouHelp} {assocName(props.currentAssoc)}
        ?
      </h5>
      <p style={{ fontSize: 14, marginBottom: 7 }} id="regular-text">
        {translatedStrings[language].HelpOrganization_Text1}
      </p>
      <Form.Check
        type="checkbox"
        id="regular-text"
        label={translatedStrings[language].HelpOrganization_Text2}
        checked={props.canHelp}
        onChange={() => {
          props.setCanHelp(!props.canHelp);
        }}
        style={{ fontSize: 12, color: "black", marginBottom: 5 }}
      />
      {props.canHelp ? (
        <Form.Control
          as="textarea"
          rows="3"
          value={props.helpDetails}
          onChange={props.handleFieldChange}
          placeholder={translatedStrings[language].HelpOrganization_Text3}
        />
      ) : (
        <></>
      )}
    </Form.Group>
  );
}

HelpOrganization.propTypes = {
  currentAssoc: PropTypes.object,
  canHelp: PropTypes.bool,
  setCanHelp: PropTypes.func,
  helpDetails: PropTypes.string,
  handleFieldChange: PropTypes.func,
  setSwithToLanguage: PropTypes.func,
  switchToLanguage: PropTypes.string,
};
