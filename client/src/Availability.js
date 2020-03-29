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
        <Form.Group controlId="phone" bssize="large" style = {{marginBottom: 30, marginTop: 20}}>
            <Form.Label style = {{marginBottom: -10}}><h3>Availability</h3></Form.Label>
            <p style = {{fontWeight: 300, fontStyle: 'italic'}}>Switch on whether you are available to help.</p>
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