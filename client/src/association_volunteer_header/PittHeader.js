import React from "react";

export default function PittHeader() {
    return (
        <>
            <h1 id="small-header">Volunteer Registration (Pittsburgh Mutual Aid)</h1>
            <p id="regular-text" style={{marginBottom: 5}}>
                Creating an account allows you to be listed as a volunteer in your area under Pittsburgh Mutual Aid. 
                Once logged in, you will be able to update your availability and indicate 
                which tasks you’re able to complete.
            </p>
            <p id="regular-text" style={{fontStyle: 'italic', marginTop: 0}}>
                Your contact information will <strong id='hello-name' style={{marginRight: 0}}>never</strong> be publicly visible.
            </p>
        </>
    );
}