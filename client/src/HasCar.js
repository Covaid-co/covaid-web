import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'

export default function HasCar(props) {

    return (
        <Form.Group controlId="payment" bssize="large" style = {{marginBottom: 30}}>
            <Form.Label style = {{marginBottom: 0, color: "black"}}><h3>Do you have a car?</h3></Form.Label>
            <Form.Control as="select"
                    onChange={(e) => {
                        e.persist();
                        if (e.target.selectedIndex === 1) {
                            props.setHasCar(true);
                        } else {
                            props.setHasCar(false);
                        }
                    }}
                    value = {props.hasCar ? "Yes" : "No"}
                    style = {{fontSize: 13}}>
                <option>No</option>
                <option>Yes</option>
            </Form.Control>
        </Form.Group>
    );
}