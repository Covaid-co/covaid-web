import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { currURL } from "./constants";

/**
 * If we can carry translated string from homepage.js, we can ignore this part and add props for all translatedStrings
 */
import LocalizedStrings from "react-localization";
import { translations } from "./translations/translations";

let translatedStrings = new LocalizedStrings({ translations });

// Can't find link (Request support) specific to Baltimore
export const cantFindLink = (currentAssoc, updateRequestHelpMode) => {
  if (currentAssoc && currentAssoc.name === "Baltimore Mutual Aid") {
    return (
      <Button
        variant="link"
        style={{ marginTop: 10 }}
        onClick={() => updateRequestHelpMode("general")}
        id="general-request-link"
      >
        Can't find what you're looking for? Click here.
      </Button>
    );
  }
  return <></>;
};

// Display Volunteer button if logged in
export const volunteerButton = (loggedIn, language) => {
  console.log(language);
  var volButton = (
    <Button
      onClick={() => {
        window.open(currURL + "/volunteerPortal", "_self");
      }}
      id="request-button"
      style={{ marginRight: 15 }}
    >
      {translations[language].VolunteerPortal}
    </Button>
  );
  if (!loggedIn) {
    volButton = <></>;
  }
  return volButton;
};
