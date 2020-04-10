import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'

export default function Availability(props) {

    const handleChangeAvailability = (event) => {
        event.persist();
        props.setAvailability(!props.switchSelected);
        props.setSwitchSelected(!props.switchSelected);
        const aText = !props.switchSelected ? 'Available' : 'Unavailable'
        props.setAvailableText(aText);
    };

    return (
        <Form.Group controlId="phone" bssize="large" style = {{marginBottom: 0, marginTop: 20}}>
            <Form.Label style = {{marginBottom: -10, color: "black"}}>
                <h5 className="volunteerName" style={{marginTop: 8}}>
                    Availability
                </h5>
            </Form.Label>
            <p style={{fontSize: 15}}  id="locationInfo">Switch on whether you are available to offer support.</p>
            <Form.Check 
                type="switch"
                id="custom-switch"
                style={{color: '#7F7F7F', fontSize: 14}}
                label=""
                checked={props.switchSelected}
                onChange={handleChangeAvailability}/>
        </Form.Group>
    );
    
}