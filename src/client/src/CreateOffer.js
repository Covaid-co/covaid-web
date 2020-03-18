import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormFields } from "./libs/hooksLib";

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'


export default function CreateOffer() {
    const [fields, handleFieldChange] = useFormFields({
        task: "",
        description: "",
    });

    const handleSubmit = async e => {
        e.preventDefault();
        let form = {
            'task': fields.task,
            'latitude': 100.0,
            'longitude': 100.0,
            'neighborhood_name': "Eagleville",
            'description': fields.description,
        };
        console.log(form)
        fetch('/api/offers/create', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })
        .then((response) => {
            if (response.ok) {
                console.log("Offer successfully created")
            } else {
                console.log("Offer not successful")
            }
        })
        .catch((e) => {
            console.log("Error")
        });
      };

    return (
        <div className="shadow p-3 mb-5 bg-white rounded">
            <Row className="justify-content-md-center">
                <Col md={2}></Col>
                <Col md={8}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="task" bssize="large">
                            <Form.Label>Task</Form.Label>
                            <Form.Control 
                                placeholder="Enter your task" 
                                value={fields.task}
                                onChange={handleFieldChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="description" bssize="large">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                placeholder="Description" 
                                value={fields.description}
                                onChange={handleFieldChange}
                            />
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