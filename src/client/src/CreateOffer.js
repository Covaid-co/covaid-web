import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'


export const CreateOffer = () => {
    return (
        <div class="shadow p-3 mb-5 bg-white rounded">
            <Row className="justify-content-md-center">
                <Col md={2}></Col>
                <Col md={8}>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Task</Form.Label>
                            <Form.Control placeholder="Enter your task" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Description</Form.Label>
                            <Form.Control placeholder="Password" />
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Check me out" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
                <Col md={2}></Col>
            </Row>
        </div>
    );
}