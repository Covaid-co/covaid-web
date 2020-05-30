import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import { currURL } from './constants';

/**
 * If we can carry translated string from homepage.js, we can ignore this part and add props for all translatedStrings
 */
import LocalizedStrings from 'react-localization';
import {translations} from './translations/translations';

let translatedStrings = new LocalizedStrings({translations});

// Can't find link (Request support) specific to Baltimore
export const cantFindLink = (currentAssoc, updateRequestHelpMode) => {

    if (currentAssoc && currentAssoc.name === 'Baltimore Mutual Aid') {
        return <Button variant="link" style={{marginTop: 10}} onClick={() => updateRequestHelpMode('general')} id="general-request-link">
                    Can't find what you're looking for? Click here.
                </Button>
    }
    return <></>;
}

// Request support Button specific to Baltimore
<<<<<<< HEAD
export const supportButton = (currentAssoc, updateRequestHelpMode) => {
  var helpButton = (
    <Button
      onClick={() => updateRequestHelpMode("general")}
      id="request-button"
    >
      I need help →
    </Button>
  );
  if (currentAssoc && currentAssoc.name === "Baltimore Mutual Aid") {
    helpButton = <></>;
  }
  return helpButton;
};
=======
export const supportButton = (currentAssoc, updateRequestHelpMode, language) => {
    var helpButton = <Button onClick={() => updateRequestHelpMode('general')} id="request-button" >
                        {translatedStrings[language].RequestSupport}
                    </Button>
    if (currentAssoc && currentAssoc.name === "Baltimore Mutual Aid") {
        helpButton = <></>;
    }
    return helpButton;
}

>>>>>>> origin/translation

// Display Volunteer button if logged in
export const volunteerButton = (loggedIn, language) => {
    var volButton = <Button onClick={()=>{window.open(currURL + '/volunteerPortal', '_self');}} 
                            id="request-button" style={{marginRight: 15}}>
                        {translatedStrings[language].VolunteerPortal}
                    </Button>
    if (!loggedIn) {
        volButton = <></>;
    }
    return volButton;
}
