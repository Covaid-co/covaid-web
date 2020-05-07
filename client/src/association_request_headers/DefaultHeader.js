import React from "react";

export default function DefaultHeader(props) {
    return (
        <>
            {props.modal ? <></> : 
                <h1 id="small-header">Request for Support</h1>}
            <p id="regular-text">
                {props.requestHeaderText}
            </p>
            <p id="request-calling" style={{borderBottom: '0px solid', marginBottom: 0}}> For those who would rather call in a request, 
                please call:<br /><span id="phoneNumber">(401) 526-8243</span></p>
        </>
    );
}