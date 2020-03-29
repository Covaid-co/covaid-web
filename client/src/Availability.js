import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'
import fetch_a from './util/fetch_auth';

export default function Availability(props) {

    const handleChangeSwitch = (evnt) => {
        let form = {
          'availability': !props.switchSelected
        };
        props.setSwitchSelected(!props.switchSelected);
        const aText = !props.switchSelected ? 'Available' : 'Not Available'
        props.setAvailableText(aText);

        fetch_a('/api/users/update/', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })
        .then((response) => {
            if (response.ok) {
              console.log("Update successful");
            } else {
              console.log("Update not successful");
            }
        })
        .catch((e) => {
            console.log("Error");
        });
    }

    return (
        <Form.Group controlId="phone" bssize="large" style = {{marginBottom: 30, marginTop: 20}}>
            <Form.Label style = {{marginBottom: -10}}><h3>Availability</h3></Form.Label>
            <p style = {{fontWeight: 300, fontStyle: 'italic'}}>Switch on whether you are available to help.</p>
            <Form.Check 
                type="switch"
                id="custom-switch"
                label={props.availableText}
                checked={props.switchSelected}
                onChange={handleChangeSwitch}
            />
        </Form.Group>
    );
    
}