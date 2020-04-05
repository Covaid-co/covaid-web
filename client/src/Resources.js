import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Form from 'react-bootstrap/Form'


export default function Resources(props) {

    const handleResourceChange = (e, resource) => {
        props.setResources(prev => ({ 
            ...prev,
            [resource]: !props.resources[resource],
        }));
    } 

    return (
        <Form.Group controlId="payment" bssize="large" style = {{marginBottom: 30}}>
            <Form.Label style = {{marginBottom: 0, color: "black"}}><h3>Resources</h3></Form.Label>
            <p style = {{fontWeight: 300, fontStyle: 'italic'}} id="createAccountText">Select what resources you can support</p>
            {Object.keys(props.resources).map(function(resource) {
                return  <Form.Check key={resource} 
                                    type = "checkbox"
                                    label = {resource}
                                    onChange = {(evt) => { handleResourceChange(evt, resource) }}
                                    checked = {props.resources[resource]} 
                                    style = {{fontSize: 14, marginTop: 1, color: "black"}}/>
            })}
        </Form.Group>
    );
    
}