import React from "react";

export default function OrgHeader(props) {
    return (
        <>
            <h1 id="small-header">Volunteer Registration ({props.assoc.name})</h1>
            <p id="regular-text" style={{marginBottom: 5}}>
                Creating an account allows you to be listed as a volunteer in your area under {props.assoc.name}. 
                Once logged in, you will be able to update your availability and indicate what you are offering.
            </p>
            <p id="regular-text" style={{fontStyle: 'italic', marginTop: 0}}>
                Your contact information will <strong id='hello-name' style={{marginRight: 0}}>never</strong> be publicly visible.
            </p>
        </>
    );
}