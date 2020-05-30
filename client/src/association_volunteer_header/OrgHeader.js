import React from "react";
import PropTypes from "prop-types";

import LocalizedStrings from "react-localization";
import { translations } from "../translations/translations";

let translatedStrings = new LocalizedStrings({ translations });

export default function OrgHeader(props) {
  return (
    <>
      <h1 id="small-header">
        {translatedStrings[props.language].VolunteerRegistration} (
        {props.assoc.name})
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

OrgHeader.propTypes = {
  setLanguage: PropTypes.func,
  language: PropTypes.string,
};
