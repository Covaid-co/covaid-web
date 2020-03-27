import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormFields } from "./libs/hooksLib";

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Toast from 'react-bootstrap/Toast'
import ReCAPTCHA from "react-google-recaptcha";


export default function Register(props, switchToLogin) {
    const [fields, handleFieldChange] = useFormFields({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [currentTerms, setCurrentTerms] = useState({
        0: false, 
        1: false,
        2: false,
        3: false,
        4: false,
        5: false
    }); 

    const [captcha, setCaptcha] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const terms = [0, 1, 2, 3, 4, 5];
    const termSentences = [
        'I have not traveled out-of-country in the past 14 days',
        'I am not exhibiting any symptoms of COVID-19 (cough, fever, etc.)',
        'I have not come in contact with a sick person in the past 14 days',
        'I have been practicing social distancing -- staying indoors, avoiding crowds, staying 6 feet away from other people if you have to go outside',
        'I will take take every CDC-provided safety precaution',
        'I understand that Covaid is strictly a volunteer group established to help during these extraordinary times created by the COVID-19 pandemic and agree to release and hold them harmless for any damages, financial or otherwise, which may occur during fulfillment of the services which I have requested.'
    ];

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
        
        if (phoneOnlyDigits.length != 0 && phoneOnlyDigits.length !== 10) {
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

        for (const term in currentTerms) {
            if (currentTerms[term] === false) {
                setShowToast(true);
                setToastMessage('Must agree to all choices');
                return false;
            }
        }
        
        if (captcha === false) {
            setShowToast(true);
            setToastMessage('Captcha not checked');
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
        } else {
            form['user']['phone'] = ''
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
                console.log("exists");
                setShowToast(true);
                setToastMessage('Email already used/exists');
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

    const handleTermChange = (event, task) => {
        console.log(currentTerms);
        setCurrentTerms(prev => ({ 
            ...prev,
            [task]: !currentTerms[task]
        }));
    }

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

                <Row style = {{marginRight: -25, marginLeft: -25, marginBottom: 0, marginTop: 10}}>
                    <Col md={12}>
                        <Form.Label style = {{marginBottom: -5}}><h4>Health *</h4></Form.Label>
                        <p style = {{fontWeight: 300, 
                                    fontStyle: 'italic', 
                                    fontSize: 13,
                                    marginBottom: 5}}>For the your safety and the safety of all community members, please check the 
                                    boxes to complete the volunteer pledge. If you have any questions about any of the choices, do not fill 
                                    out the form and contact as at covaidco@gmail.com </p>
                    </Col>
                </Row>

                <Row className="justify-content-md-center"
                    style = {{marginRight: -25, marginLeft: -25, marginBottom: 20}}>
                    <Col md={12}>
                    {terms.map((term) => {
                        return <Form.Check key={term} 
                                        type = "checkbox" 
                                        label = {termSentences[term]}
                                        onChange = {(evt) => { handleTermChange(evt, term) }}
                                        checked = {currentTerms[term]} 
                                        style = {{fontSize: 12, marginTop: 2}}/>
                    })}
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

                <ReCAPTCHA
                    sitekey="6LeZmeQUAAAAALo6YR9A7H-f7EZsYj3c0KJ189Ev"
                    onChange={() => {setCaptcha(true)}}
                    style = {{marginBottom: 10}}
                />

                <Row
                    style = {{marginRight: -25, marginLeft: -25}}>
                    <Col md="auto" style = {{marginLeft: 10}}>
                        <Button variant="primary" type="submit">
                            Sign up!
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}