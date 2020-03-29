import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function NeededBy(props) {

    return (
        <>
            <h5 className="titleHeadings" style = {{marginTop: '26px', marginBottom: '8px'}}>
                When will this needed by?
            </h5>
            <Row >
                <Col xs={6} style = {{paddingRight: '4px'}}>
                    <Form.Group controlId="time">
                        <Form.Control as="select">
                            <option>Morning</option>
                            <option>2</option>
                            <option>3</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col xs={6} style = {{paddingLeft: '4px'}}>
                    <Form.Group controlId="time" bssize="large">
                        <Form.Control as="select">
                            <option>Jan 22, 2019</option>
                            <option>2</option>
                            <option>3</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
        </>
    );
}