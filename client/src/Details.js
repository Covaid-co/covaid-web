import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Form from 'react-bootstrap/Form'



export default function Details(props) {
    
    return (
        <Form.Group controlId="details" bssize="large" style = {{marginBottom: 0, marginTop: 30}}>
            <h5 className="volunteerName">Details?</h5>
            <p style={{fontSize: 15}} id="locationInfo">Let us know more about you and how you can help! Be as specific as you can so that we can make sure to match you more quickly.</p>
            <p style = {{fontWeight: 300, fontSize: 14, fontStyle: 'italic', marginTop: -3}} id="createAccountText">
                Example: "I am a college student, and am happy to deliver food from stores or food banks in St. Louis County! I would prefer if requesters could call ahead and pay over the phone."
            </p>
            <Form.Control as="textarea" 
                        rows="3" 
                        value={props.fields} 
                        onChange={props.handleFieldChange}/>
        </Form.Group>
    );
}