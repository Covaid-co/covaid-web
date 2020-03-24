import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormFields } from "./libs/hooksLib";

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Cookie from 'js-cookie'


export default function Register(props) {
    const [fields, handleFieldChange] = useFormFields({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: ""
    });

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
        if (phone == undefined || phone === '' || phone.length === 0) {
            return true;
        } else if (phone.length === 10) {
            return (/^\d+$/.test(fields.phone));
        } else {
            return false;
        }
    }

    function validateForm() {
        return (
          fields.email.length > 0 && validateEmail(fields.email) &&
          fields.password.length > 0 &&
          fields.first_name.length > 0 &&
          fields.last_name.length > 0 &&
          validatePhone(fields.phone) &&
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
                'availability': false,
                'location': {
                    'type': 'Point',
                    'coordinates': [props.state.longitude, props.state.latitude]
                }
            }
        };

        if (fields.phone.length > 0) {
            form['user']['phone'] = fields.phone;
        }
        fetch('/api/users/', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                response.json().then(data => {
                    console.log("Registration successful");
                    Cookie.set("token", data.user.token);
                    window.location.reload(false);
                });
            } else {
                alert('Email already exists');
            }
        }).catch((e) => {
            alert('Registration unsuccessful');
        });
      };

    return (
        <div className="p-3 bg-white">
            <Form onSubmit={handleSubmit}>
                <Row className="justify-content-md-center"
                    style = {{marginRight: -25, marginLeft: -25}}>
                    <Col md={12} style={{marginTop: -15}}>
                        <p> Creating an account allows you to volunteer an offer
                        to help your community. Once logged in, you will be able to update your
                        offer with things such availability or tasks.</p>
                    </Col>
                    <Col md={12} style={{fontStyle: "italic", marginTop: -13, fontSize: 14}}>
                        <p>Your private information contact information will <bold style = {{fontWeight: 700}}>never</bold> be
                        publicly visible.</p>
                    </Col>
                </Row>
                <Row className="justify-content-md-center"
                    style = {{marginRight: -25, marginLeft: -25}}>
                    <Col md={6}>
                        <Form.Group controlId="first_name" bssize="large">
                            <Form.Control 
                                placeholder="First Name"
                                value={fields.first_name}
                                onChange={handleFieldChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="last_name" bssize="large">
                            <Form.Control
                                placeholder="Last Name"
                                value={fields.last_name}
                                onChange={handleFieldChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="justify-content-md-center"
                    style = {{marginRight: -25, marginLeft: -25}}>
                    <Col md={12}>
                        <Form.Group controlId="email" bssize="large">
                            <Form.Control 
                                type="email"
                                placeholder="Email"
                                value={fields.email}
                                onChange={handleFieldChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={12}>
                        <Form.Group controlId="phone" bssize="large">
                            <Form.Control 
                                placeholder="Phone (Optional)"
                                value={fields.phone}
                                onChange={handleFieldChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="justify-content-md-center"
                    style = {{marginRight: -25, marginLeft: -25}}>
                    <Col md={6}>
                        <Form.Group controlId="password" bssize="large">
                            <Form.Control 
                                placeholder="Password"
                                value={fields.password}
                                onChange={handleFieldChange}
                                type="password"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="confirmPassword" bssize="large">
                            <Form.Control
                                type="password"
                                placeholder="Confirm Password"
                                onChange={handleFieldChange}
                                value={fields.confirmPassword}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="justify-content-md-center"
                    style = {{marginRight: -25, marginLeft: -25}}>
                    <Col md="auto">
                    <Button variant="primary" disabled={!validateForm()} type="submit">
                        Submit
                    </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}