import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormFields } from "./libs/hooksLib";

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Cookie from 'js-cookie'



export default function Register() {
    const [fields, handleFieldChange] = useFormFields({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: ""
    });

    function validateForm() {
        return (
          fields.email.length > 0 &&
          fields.password.length > 0 &&
          fields.first_name.length > 0 &&
          fields.last_name.length > 0 &&
          fields.phone.length > 0 &&
          fields.password === fields.confirmPassword
        );
      }

    const handleSubmit = async e => {
        e.preventDefault();
        let form = {
            'user': {
                'first_name': fields.first_name,
                'last_name': fields.last_name,
                'email': fields.email,
                'password': fields.password,
                'availability': true,
            }
        };

        if (fields.phone.length > 0) {
            form = {
                'user': {
                    'first_name': fields.first_name,
                    'last_name': fields.last_name,
                    'email': fields.email,
                    'phone': fields.phone,
                    'password': fields.password,
                    'availability': true,
                }
            }
        }
        console.log(form)
        fetch('/api/users/', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })
        .then((response) => {
            if (response.ok) {
                response.json().then(data => {
                    console.log("Registration successful")
                    Cookie.set("token", data.user.token);
                    window.location.reload(false);
                });
            } else {
                console.log("Registration not successful")
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
                        <Form.Group controlId="first_name" bssize="large">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control 
                                value={fields.first_name}
                                onChange={handleFieldChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="last_name" bssize="large">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control 
                                value={fields.last_name}
                                onChange={handleFieldChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="email" bssize="large">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email"
                                value={fields.email}
                                onChange={handleFieldChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="phone" bssize="large">
                            <Form.Label>Phone (Optional)</Form.Label>
                            <Form.Control 
                                value={fields.phone}
                                onChange={handleFieldChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="password" bssize="large">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                value={fields.password}
                                onChange={handleFieldChange}
                                type="password"
                            />
                        </Form.Group>

                        <Form.Group controlId="confirmPassword" bssize="large">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                onChange={handleFieldChange}
                                value={fields.confirmPassword}
                            />
                        </Form.Group>

                        <Button variant="primary" disabled={!validateForm()} type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
                <Col md={2}></Col>
            </Row>
        </div>
    )


}