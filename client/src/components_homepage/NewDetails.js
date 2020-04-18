import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function NewDetails(props) {

    return (
        <>
            <h5 id="regular-text-bold" style = {{marginTop: '24px', marginBottom: 0}}>
                Details about request
            </h5>
            <p style={{fontSize: 14, marginBottom: 0}} id="regular-text">
                Use as much detail as you feel comfortable sharing, no judgements here
            </p>
            <Row >
                <Col xs={12}>
                    <Form.Group controlId="details">
                        <Form.Control as="textarea" rows="3" 
                                        placeholder="Example: 'I'm quarantined and need groceries for the week. Can they can be dropped
                                        off at 123 Main street?'"
                                        value={props.fields.details} 
                                        onChange={props.handleFieldChange}/>
                    </Form.Group>
                </Col>
            </Row>
        </>
    );
}