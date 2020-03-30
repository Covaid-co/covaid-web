import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function NewDetails(props) {

    return (
        <>
            <h5 className="titleHeadings" style = {{marginTop: '26px', marginBottom: '8px'}}>
                Details about request
            </h5>
            <Row >
                <Col xs={12}>
                    <Form.Group controlId="details">
                        <Form.Control as="textarea" 
                                        rows="3" 
                                        placeholder="Example: 'I need milk and eggs and they can be dropped
                                        off at 123 Main street. I can pre-pay via Venmo or Paypal.'"
                                        value={props.fields.details} 
                                        onChange={props.handleFieldChange}
                                        />
                    </Form.Group>
                </Col>
            </Row>
        </>
    );
}