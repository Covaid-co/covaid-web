import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * If we can carry translated string from homepage.js, we can ignore this part and add props for all translatedStrings
 */
import LocalizedStrings from "react-localization";
import { translations } from "../translations/translations";

let translatedStrings = new LocalizedStrings({ translations });

export default function OrgHeader(props) {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (props.switchToLanguage === "Español") {
      setLanguage("es");
    } else {
      setLanguage("en");
    }
  }, [props.switchToLanguage]);

  return (
    <>
      <h1 id="small-header">
        {translatedStrings[language].VolunteerRegistration} ({props.assoc.name})
      </h1>
      <p id="regular-text" style={{ marginBottom: 5 }}>
        {translatedStrings[language].VolunteerRegistration_Text1}
      </p>
      <p id="regular-text" style={{ fontStyle: "italic", marginTop: 0 }}>
        {translatedStrings[language].VolunteerRegistration_Text2}{" "}
        <strong id="hello-name" style={{ marginRight: 0 }}>
          {translatedStrings[language].VolunteerRegistration_Text3}
        </strong>{" "}
        {translatedStrings[language].VolunteerRegistration_Text4}
      </p>
    </>
  );
}

OrgHeader.propTypes = {
  setSwithToLanguage: PropTypes.func,
  switchToLanguage: PropTypes.string,
};
