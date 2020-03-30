import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Form from 'react-bootstrap/Form'


export default function Details(props) {
    
    return (
        <Form.Group controlId="details" bssize="large" style = {{marginBottom: 0, marginTop: 30}}>
            <Form.Label style = {{marginBottom: -10, color: "black"}}>
            <h5 className="titleHeadings" style = {{marginTop: '8px', marginBottom: '8px', color:"black"}}>
                Details
            </h5>
            </Form.Label>
            <p style = {{fontWeight: 300, fontStyle: 'italic'}} id="createAccountText">Give us more information on how you can help!</p>
            <p style = {{fontWeight: 300, fontSize: 14, fontStyle: 'italic', marginTop: -13}} id="createAccountText">
                Example: "I am free after 6pm on weekdays and am happy to deliver from any store or pharmacy in St. Louis County!"
            </p>
            <Form.Control as="textarea" 
                        rows="3" 
                        value={props.fields} 
                        onChange={props.handleFieldChange}/>
        </Form.Group>
    );
}