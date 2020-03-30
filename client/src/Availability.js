import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'
import fetch_a from './util/fetch_auth';

export default function Availability(props) {

    const handleChangeAvailability = (event) => {
        event.persist();
        props.setAvailability(!props.switchSelected);
        props.setSwitchSelected(!props.switchSelected);
        const aText = !props.switchSelected ? 'Available' : 'Not Available'
        props.setAvailableText(aText);
    };

    return (
        <Form.Group controlId="phone" bssize="large" style = {{marginBottom: 0, marginTop: 20}}>
            <Form.Label style = {{marginBottom: -10, color: "black"}}><h5 className="titleHeadings" style = {{color: "black", marginTop: '32px', marginBottom: '8px', color:"black"}}>
                                Availability
                            </h5></Form.Label>
            <p style = {{fontWeight: 300, fontStyle: 'italic'} } id="createAccountText">Switch on whether you are available to help.</p>
            <Form.Check 
                type="switch"
                id="custom-switch"
                label={props.availableText}
                checked={props.switchSelected}
                onChange={handleChangeAvailability}
            />
        </Form.Group>
    );
    
}