import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormFields } from "./libs/hooksLib";

import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Toast from 'react-bootstrap/Toast'
import ReCAPTCHA from "react-google-recaptcha";

import SelectionForm from './SelectionForm';
import NewLanguages from './NewLanguages';
import PhoneNumber from './PhoneNumber';
import NewHasCar from './NewHasCar';

export default function NewRegister(props, switchToLogin) {
    const [currentTerms, setCurrentTerms] = useState({
        0: false, 
        1: false,
        2: false,
        3: false,
        4: false,
        5: false
    }); 

    const [fields, handleFieldChange] = useFormFields({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const languages = ['English', 'Chinese', 'French', 'Spanish', 'Other'];
    const availability = ['Morning', 'Afternoon', 'Evening', 'Weekdays', 'Weekends'];
    const [phoneNumber, setPhoneNumber] = useState('');
    const [languageChecked, setLanguageChecked] = useState({});
    const [availabilityChecked, setAvailabilityChecked] = useState({});
    const [firstPage, setFirstPage] = useState(true);
    const [hasCar, setHasCar] = useState(false);
    const [justRegistered, setJustRegistered] = useState(false);

    const [captcha, setCaptcha] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
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

    const handleTermChange = (event, task) => { 
        setCurrentTerms(prev => ({ 
            ...prev,
            [task]: !currentTerms[task]
        }));
    }

    const checkFirstPageInput = () => {
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

        const phoneOnlyDigits = phoneNumber.replace(/\D/g,'').substring(0,10);
        if (phoneOnlyDigits.length !== 0 && phoneOnlyDigits.length !== 10) {
            setShowToast(true);
            setToastMessage('Enter a valid phone number');
            return false;
        }

        if (fields.email.length === 0 || 
            validateEmail(fields.email) === false) {
            setShowToast(true);
            setToastMessage('Enter a valid email');
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

        if (Object.values(languageChecked).every(v => v === false)) {
            setShowToast(true);
            setToastMessage('No language selected');
            return false;
        }

        if (Object.values(availabilityChecked).every(v => v === false)) {
            setShowToast(true);
            setToastMessage('No availability selected');
            return false;
        }
        return true;
    }

    const extractTrueObj = (obj) => {
        var result = [];
        for (const p in obj) {
            if (obj[p]) {
                result.push(p);
            }
        }
        return result;
    }

    const checkSecondPageInput = () => {
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

    // Check whether to go to second page
    const goToSecondPage = () => {
        if (checkFirstPageInput()) {
            setFirstPage(false);
        }
    }

    const newHandleSubmit = async e => {
        e.preventDefault();
        if (checkSecondPageInput() === false) {
            return;
        }

        const selectedLanguages = extractTrueObj(languageChecked);
        const selectedTimes = extractTrueObj(availabilityChecked);
        var phoneString = '';
        if (phoneNumber.length > 0) {
            phoneString = phoneNumber.replace(/\D/g,'').substring(0,10);
        }

        var associationID = (Object.keys(props.state.currentAssoc).length !== 0) ? props.state.currentAssoc['_id'] : "";
        var associationName = (Object.keys(props.state.currentAssoc).length !== 0) ? props.state.currentAssoc['name'] : "";

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
                },
                'association': associationID, 
                'association_name': associationName,
                'languages': selectedLanguages,
                'times_available': selectedTimes,
                'phone': phoneString
            }
        };

        fetch('/api/users/', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                response.json().then(data => {
                    console.log("Registration successful");
                    setJustRegistered(true);
                });
            } else {
                console.log(response);
                setShowToast(true);
                setToastMessage('Email already used/exists');
            }
        }).catch((e) => {
            console.log(e);
            setShowToast(true);
            setToastMessage('Register unsuccessful');
        });
    }

    if (justRegistered === false) {
        if (firstPage) {
            return (
                <Modal show={props.state.showRegistration} onHide={props.handleHideRegistration} id='showRequestModal'>
                    <Modal.Header closeButton>
                        <Modal.Title>Create a new account</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p id="createAccountText">
                            Creating an account allows you to be listed as a volunteer in your area. 
                            Once logged in, you will be able to update your availability and indicate 
                            which tasks you’re able to complete.
                        </p>
                        <p id="contactInfoText">
                            Your contact information will <strong id='never'>never</strong> be publicly visible.
                        </p>
                        <h5 className="titleHeadings">Personal Information</h5>
                        <Row>
                            <Col xs={6} style = {{paddingRight: '4px'}}>
                                <Form.Group controlId="first_name" bssize="large">
                                    <Form.Control value={fields.first} onChange={handleFieldChange} placeholder="First Name" />
                                </Form.Group>
                            </Col>
                            <Col xs={6} style = {{paddingLeft: '4px'}}>
                                <Form.Group controlId="last_name" bssize="large">
                                    <Form.Control value={fields.last} onChange={handleFieldChange} placeholder="Last Name" />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <PhoneNumber phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}/>
                            </Col>
                            <Col xs={12}>
                                <Form.Group controlId="email" bssize="large">
                                    <Form.Control value={fields.email} onChange={handleFieldChange} placeholder="Email" />
                                </Form.Group>
                            </Col>
                            <Col xs={6} style = {{paddingRight: '4px'}}>
                                <Form.Group controlId="password" bssize="large">
                                    <Form.Control 
                                        placeholder="Password"
                                        value={fields.password}
                                        onChange={handleFieldChange}
                                        type="password"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} style = {{paddingLeft: '4px'}}>
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
                        <h5 className="titleHeadings" style = {{marginTop: '18px', marginBottom: '4px'}}>
                            What languages do you speak?
                        </h5>
                        <NewLanguages languages={languages} languageChecked={languageChecked} setLanguageChecked={setLanguageChecked}/>
                        <h5 className="titleHeadings" style = {{marginTop: '24px', marginBottom: '4px'}}>
                            Can you drive?
                        </h5>
                        <NewHasCar hasCar={hasCar} setHasCar={setHasCar}/>
                        <h5 className="titleHeadings" style = {{marginTop: '24px', marginBottom: '8px'}}>
                            What is your general availability?
                        </h5>
                        <NewLanguages languages={availability} languageChecked={availabilityChecked} setLanguageChecked={setAvailabilityChecked}/>
                        <Button style={{marginTop: 30}}
                                id="createAccount"
                                onClick={goToSecondPage}>Next</Button>
                        <p id="pageNumber">Page 1 of 2</p>
                        <Toast
                            show={showToast}
                            delay={3000}
                            onClose={() => setShowToast(false)}
                            autohide
                            id='toastError'>
                            <Toast.Body>{toastMessage}</Toast.Body>
                        </Toast>
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                </Modal>
            );
        } else {
            return (
                <Modal show={props.state.showRegistration} onHide={() => {props.handleHideRegistration(); setFirstPage(true);}} id='showRequestModal'>
                    <Modal.Header closeButton>
                        <Modal.Title>Almost Done!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={newHandleSubmit}>
                            <SelectionForm associations={props.state.associations} setState={props.setState} currentAssoc={props.state.currentAssoc}/>
                            <h5 className="titleHeadings" style = {{marginTop: '10px', marginBottom: '4px'}}>
                                Health
                            </h5>
                            <p id="createAccountText" style={{marginBottom: 20}}>
                                For the your safety and the safety of all community members, please check 
                                the boxes to complete the volunteer pledge. If you have any questions about 
                                any of the choices, do not fill out the form and contact us at covaidco@gmail.com
                            </p>
                            <Row>
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
                            <ReCAPTCHA
                                sitekey="6LeZmeQUAAAAALo6YR9A7H-f7EZsYj3c0KJ189Ev"
                                onChange={() => {setCaptcha(true)}}
                                style = {{marginBottom: 0, marginTop: 20}}
                            />
                            <Button id="nextPage" type="submit">Sign up!</Button>
                        </Form>
                        <p id="pageNumber">Page 2 of 2</p>
                        <Toast
                            show={showToast}
                            delay={3000}
                            onClose={() => setShowToast(false)}
                            autohide
                            id='toastError'>
                            <Toast.Body>{toastMessage}</Toast.Body>
                        </Toast>
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                </Modal>
            )
        }
    } else {
        return (
            <Modal show={justRegistered} onHide={() => {setJustRegistered(false); setFirstPage(true); props.handleHideRegistration();}}>
                <Modal.Header closeButton>
                    <Modal.Title>Check your email for a verification link!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id="locationInfo">
                        Once verified, you will be able to post an offer to help your community directly from your volunteer portal.
                    </p>
                    <Button id="nextPage" onClick={() => {setJustRegistered(false); setFirstPage(true); props.handleHideRegistration();}}>Return to home</Button>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>
        );
    }
}