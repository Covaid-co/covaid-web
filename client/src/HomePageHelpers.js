import React from "react";
import Button from 'react-bootstrap/Button';
import { currURL } from './constants';

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
export const supportButton = (currentAssoc, updateRequestHelpMode) => {
    var helpButton = <Button onClick={() => updateRequestHelpMode('general')} id="request-button" >
                        Request support
                    </Button>
    if (currentAssoc && currentAssoc.name === "Baltimore Mutual Aid") {
        helpButton = <></>;
    }
    return helpButton;
}


// Display Volunteer button if logged in
export const volunteerButton = (loggedIn) => {
    var volButton = <Button onClick={()=>{window.open(currURL + '/volunteerPortal', '_self');}} 
                            id="request-button" style={{marginRight: 15}}>
                        Volunteer portal
                    </Button>
    if (!loggedIn) {
        volButton = <></>;
    }
    return volButton;
}
