import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function PaymentMethod(props) {

    return (
        <>
            <h5 className="titleHeadings" style = {{marginTop: '26px', marginBottom: '8px'}}>
                Payment Method
            </h5>
            <Row >
                <Col xs={12}>
                    <Form.Group controlId="payment">
                        <Form.Control as="select">
                            <option>Pay after request is filled</option>
                            <option>2</option>
                            <option>3</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
        </>
    );
}