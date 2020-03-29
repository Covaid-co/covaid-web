import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Form from 'react-bootstrap/Form'


export default function Details(props) {
    
    return (
        <Form.Group controlId="details" bssize="large" style = {{marginBottom: 30}}>
            <Form.Label style = {{marginBottom: -10}}><h3>Details</h3></Form.Label>
            <p style = {{fontWeight: 300, fontStyle: 'italic'}}>Give us more information on how you can help!</p>
            <p style = {{fontWeight: 300, fontSize: 14, fontStyle: 'italic', marginTop: -13}}>
                Example: "I am free after 6pm on weekdays and am happy to deliver from any store or pharmacy in St. Louis County!"
            </p>
            <Form.Control as="textarea" 
                        rows="3" 
                        value={props.fields} 
                        onChange={props.handleFieldChange}/>
        </Form.Group>
    );
}