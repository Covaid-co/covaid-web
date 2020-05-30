import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * If we can carry translated string from homepage.js, we can ignore this part and add props for all translatedStrings
 */
import LocalizedStrings from "react-localization";
import { translations } from "../translations/translations";

let translatedStrings = new LocalizedStrings({ translations });

export default function DefaultHeader(props) {
  return (
    <>
      <h1 id="small-header">
        {translatedStrings[props.language].VolunteerRegistration}
      </h1>
      <p id="regular-text" style={{ marginBottom: 5 }}>
        {translatedStrings[props.language].VolunteerRegistration_Text1}
      </p>
      <p id="regular-text" style={{ fontStyle: "italic", marginTop: 0 }}>
        {translatedStrings[props.language].VolunteerRegistration_Text2}{" "}
        <strong id="hello-name" style={{ marginRight: 0 }}>
          {translatedStrings[props.language].VolunteerRegistration_Text3}
        </strong>{" "}
        {translatedStrings[props.language].VolunteerRegistration_Text4}
      </p>
    </>
  );
}

DefaultHeader.propTypes = {
  setLanguage: PropTypes.func,
  language: PropTypes.string,
};
