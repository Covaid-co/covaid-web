import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormFields } from "./libs/hooksLib";

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Toast from 'react-bootstrap/Toast'

import Cookie from 'js-cookie'

export default function Register(props, switchToLogin) {
    const [fields, handleFieldChange] = useFormFields({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const checkInputs = () => {
        if (fields.first_name.length === 0) {
            setShowToast(true);
            setToastMessage('Enter a first name');
            return false;
        }

        if (fields.last_name.length === 0) {
            setShowToast(true);
            setToastMessage('Enter a last name');
            return false;
        }

        if (fields.email.length === 0 || 
            validateEmail(fields.email) === false) {
            setShowToast(true);
            setToastMessage('Enter a valid email');
            return false;
        }

        const phoneOnlyDigits = phoneNumber.replace(/\D/g,'').substring(0,10);
        console.log(phoneOnlyDigits);

        if (phoneOnlyDigits.length !== 10) {
            setShowToast(true);
            setToastMessage('Enter a valid phone number');
            return false;
        }

        if (fields.password.length === 0) {
            setShowToast(true);
            setToastMessage('Set a password');
            return false;
        }
        
        if (fields.password !== fields.confirmPassword) {
            setShowToast(true);
            setToastMessage('Passwords not the same');
            return false;
        }
        return true;
    }


    const handleSubmit = async e => {
        e.preventDefault();
        if (checkInputs() === false) {
            return;
        }

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

        if (phoneNumber.length > 0) {
            form['user']['phone'] = phoneNumber;
        }

        fetch('/api/users/', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                response.json().then(data => {
                    console.log("Registration successful");
                    props.switchToLogin();
                    
                });
            } else {
                alert('Email already exists');
            }
        }).catch((e) => {
            alert('Registration unsuccessful');
        });
    };

    const isNumericInput = (event) => {
        const key = event.keyCode;
        return ((key >= 48 && key <= 57) || // Allow number line
            (key >= 96 && key <= 105) // Allow number pad
        );
    };

    const isModifierKey = (event) => {
        const key = event.keyCode;
        return (event.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
            (key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
            (key > 36 && key < 41) || // Allow left, up, right, down
            (
                // Allow Ctrl/Command + A,C,V,X,Z
                (event.ctrlKey === true || event.metaKey === true) &&
                (key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
            )
    };
    
    const enforceFormat = (event) => {
        // Input must be of a valid number format or a modifier key, and not longer than ten digits
        event.persist();
        if(!isNumericInput(event) && !isModifierKey(event)){
            event.preventDefault();
        }
    };
    
    const handleChangePhone = (event) => {
        event.persist();
        if (isModifierKey(event)) {
            return;
        }

        // I am lazy and don't like to type things more than once
        const input = event.target.value.replace(/\D/g,'').substring(0,10); // First ten digits of input only
        const zip = input.substring(0,3);
        const middle = input.substring(3,6);
        const last = input.substring(6,10);

        var result = event.target.value;
        if(input.length > 6){result = `(${zip})-${middle}-${last}`;}
        else if(input.length > 3){result = `(${zip})-${middle}`;}
        else if(input.length === 4) {result = `(${zip})`;}
        else if(input.length > 0){result = `(${zip}`;}
        setPhoneNumber(result);
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
                                value={phoneNumber}
                                onKeyUp={handleChangePhone}
                                onKeyDown={enforceFormat}
                                // onKeyUp={() => {console.log('hi')}}
                                // onKeyDown={()=> {console.log("huh")}}
                                // onChange={(e) => {setPhoneNumber(e.target.value); console.log(e.target.value)}}
                                onChange={handleChangePhone}
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
                <Toast
                    show={showToast}
                    delay={3000}
                    onClose={() => setShowToast(false)}
                    autohide
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        marginBottom: 27,
                        marginRight: 10
                    }}>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>

                <Row className="justify-content-md-center"
                    style = {{marginRight: -25, marginLeft: -25}}>
                    <Col md="auto">
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}