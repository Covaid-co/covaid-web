import React from "react";

export default function DefaultHeader() {
    return (
        <>
            <h1 id="small-header">Request for Support</h1>
            <p id="regular-text">
                After submitting a general request for support, we will attempt to match you with 
                the best volunteer in your area.
            </p>
            <p id="request-calling" style={{borderBottom: '0px solid', marginBottom: 0}}> For those who would rather call in a request, 
                please call <br /><span id="phoneNumber">(401) 526-8243</span></p>
        </>
    );
}