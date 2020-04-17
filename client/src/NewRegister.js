import React, { useState, useEffect } from 'react';
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
import CheckForm from './CheckForm';
import PhoneNumber from './PhoneNumber';
import NewHasCar from './NewHasCar';
import Details from './Details'
import { validateEmail, extractTrueObj, setFalseObj } from './Helpers';
import { defaultResources, availability } from './constants';

import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY");

export default function NewRegister(props) {
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
        confirmPassword: "", 
        details: "",
        pronouns: ""
    });

    const [phoneNumber, setPhoneNumber] = useState('');
    const [taskChecked, setTaskChecked] = useState({});
    const [availabilityChecked, setAvailabilityChecked] = useState({});
    const [neighborhoodsChecked, setNeighborhoodsChecked] = useState({});
    const [pageNum, setPageNum] = useState(1);
    const [hasCar, setHasCar] = useState(false);
    const [justRegistered, setJustRegistered] = useState(false);

    const [captcha, setCaptcha] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const terms = [0, 1, 2, 3, 4, 5];
    const [termSentences, setTermSentences] = useState([
        'I have not traveled out-of-country in the past 14 days',
        'I am not exhibiting any symptoms of COVID-19 (cough, fever, etc.)',
        'I have not come in contact with a sick person in the past 14 days',
        'I have been practicing social distancing -- staying indoors, avoiding crowds, staying 6 feet away from other people if you have to go outside',
        'I will take take every CDC-provided safety precaution',
        'I understand that Covaid is strictly a volunteer group established to help during these extraordinary times created by the COVID-19 pandemic and agree to release and hold them harmless for any damages, financial or otherwise, which may occur during fulfillment of the services which I have requested.'
    ]);

    useEffect(() => {
        if (props.state.currentAssoc.resources) {
            var tempResources = setFalseObj(props.state.currentAssoc.resources);
            setTaskChecked(tempResources);
            var termsList = [
                'I have not traveled out-of-country in the past 14 days',
                'I am not exhibiting any symptoms of COVID-19 (cough, fever, etc.)',
                'I have not come in contact with a sick person in the past 14 days',
                'I have been practicing social distancing -- staying indoors, avoiding crowds, staying 6 feet away from other people if you have to go outside',
                'I will take take every CDC-provided safety precaution',
                'I understand that ' + props.state.currentAssoc.name + ' and Covaid are strictly volunteer groups established to help during these extraordinary times created by the COVID-19 pandemic and agree to release and hold them harmless for any damages, financial or otherwise, which may occur during my services as a volunteer.'
            ]
            setTermSentences(termsList);
        } else {
            var tempResources = setFalseObj(defaultResources);
            setTaskChecked(tempResources);
        }
        setAvailabilityChecked(setFalseObj(availability));
        setNeighborhoodsChecked(setFalseObj(props.state.neighborhoods));
    }, [props.state.currentAssoc])

    const handleTermChange = (event, task) => { 
        setCurrentTerms(prev => ({ 
            ...prev,
            [task]: !currentTerms[task]
        }));
    }

    const checkFirstPageInput = () => {
        var valid = true;
        const phoneOnlyDigits = phoneNumber.replace(/\D/g,'').substring(0,10);
        if (fields.first_name.length === 0) {
            setToastMessage('Enter a first name');
            valid = false;
        } else if (fields.last_name.length === 0) {
            setToastMessage('Enter a last name');
            valid = false;
        } else if (phoneOnlyDigits.length !== 10) {
            setToastMessage('Enter a valid phone number');
            valid = false;
        } else if (fields.email.length === 0 || 
            validateEmail(fields.email) === false) {
            setToastMessage('Enter a valid email');
            valid = false;
        } else if (fields.password.length === 0) {
            setToastMessage('Set a password');
            valid = false;
        } else if (fields.password !== fields.confirmPassword) {
            setToastMessage('Passwords not the same');
            valid = false;
        }

        if (valid === false) {
            setShowToast(true);
        }
        return valid;
    }

    const checkSecondPageInput = () => {
        var valid = true;
        if (Object.values(taskChecked).every(v => v === false)) {
            setToastMessage('No task selected');
            valid = false;
        } else if (Object.values(availabilityChecked).every(v => v === false)) {
            setToastMessage('No availability selected');
            valid = false;
        } else if (fields.details.length === 0) {
            setToastMessage('Please enter some details');
            valid = false;
        }

        if (valid === false) {
            setShowToast(true);
        }
        return valid;
    }

    const checkThirdPageInput = () => {
        var valid = true;
        if (Object.values(neighborhoodsChecked).every(v => v === false)) {
            setToastMessage('No neighborhood selected');
            valid = false;
        }

        for (const term in currentTerms) {
            if (currentTerms[term] === false) {
                setToastMessage('Must agree to all choices');
                valid = false;
            }
        }
        
        if (captcha === false) {
            setToastMessage('Captcha not checked');
            valid = false;
        }

        if (valid === false) {
            setShowToast(true);
        }
        return valid;
    }

    const goToSecondPage = () => {
        if (checkFirstPageInput()) {
            setPageNum(2);
        }
    }

    const goToThirdPage = () => {
        if (checkSecondPageInput()) {
            setPageNum(3);
        }
    }

    const newHandleSubmit = async e => {
        e.preventDefault();
        if (checkThirdPageInput() === false) {
            return;
        }

        const selectedTimes = extractTrueObj(availabilityChecked);
        const selectedTasks = extractTrueObj(taskChecked);
        const selectedNeighborhoods = extractTrueObj(neighborhoodsChecked);

        var phoneString = phoneNumber.replace(/\D/g,'').substring(0,10);
        var associationID = (Object.keys(props.state.currentAssoc).length !== 0) ? props.state.currentAssoc['_id'] : "5e88cf8a6ea53ef574d1b80c";
        var associationName = (Object.keys(props.state.currentAssoc).length !== 0) ? props.state.currentAssoc['name'] : "Covaid";

        let form = {
            'user': {
                'first_name': fields.first_name,
                'last_name': fields.last_name,
                'email': fields.email,
                'password': fields.password,
                'pronouns': fields.pronouns,
                'availability': true,
                'location': {
                    'type': 'Point',
                    'coordinates': [props.state.longitude, props.state.latitude]
                },
                'offer': {
                    'details': fields.details,
                    'tasks': selectedTasks,
                    'neighborhoods': selectedNeighborhoods,
                    'state': props.state.state,
                    'car': hasCar,
                    'timesAvailable': selectedTimes,
                },
                'association': associationID, 
                'association_name': associationName,
                'languages': ['English'],
                'phone': phoneString,
            }
        };
        console.log(form);

        fetch('/api/users/', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                response.json().then(data => {
                    setJustRegistered(true);
                });
            } else {
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
        if (pageNum === 1) {
            return (
                <Modal show={props.showModal} onHide={() => { props.hideModal(); setPageNum(1);}} 
                       id='showRequestModal' style={{marginTop: 10, paddingBottom: 20}}>
                    <Modal.Header closeButton>
                        <Modal.Title id="small-header">Create a new account</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p id="regular-text" style={{marginBottom: 5}}>
                            Creating an account allows you to be listed as a volunteer in your area. 
                            Once logged in, you will be able to update your availability and indicate 
                            which tasks you’re able to complete.
                        </p>
                        <p id="regular-text" style={{fontStyle: 'italic', marginTop: 0, fontSize: 14}}>
                            Your contact information will <strong id='hello-name' style={{marginRight: 0}}>never</strong> be publicly visible.
                        </p>
                        <h5 id="regular-text-bold">Personal Information</h5>
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
                                <Form.Group controlId="pronouns" bssize="large">
                                    <Form.Control value={fields.pronouns} onChange={handleFieldChange} placeholder="Preferred Pronouns (Optional)" />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <PhoneNumber phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} placeholder={"Phone"} />
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
                        <Button style={{marginTop: 15}} id="large-button-empty" onClick={goToSecondPage}>Next</Button>
                        <p id="pagenum-text">Page 1 of 3</p>
                        <Toast
                            show={showToast}
                            delay={3000}
                            onClose={() => setShowToast(false)}
                            autohide
                            id='toastError'>
                            <Toast.Body>{toastMessage}</Toast.Body>
                        </Toast>
                    </Modal.Body>
                </Modal>
            );
        } else if (pageNum === 2){
            return (
                <Modal show={props.showModal} onHide={() => { props.hideModal(); setPageNum(1);}} 
                       id='showRequestModal' style={{marginTop: 10, paddingBottom: 20}}>
                    <Modal.Header closeButton>
                        <Modal.Title id="small-header">Tell us more about you!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5 id="regular-text-bold" style = {{marginTop: 0, marginBottom: 5}}>
                            What resources can you offer?
                        </h5>
                        <CheckForm obj={taskChecked} setObj={setTaskChecked}/>
                        <h5 id="regular-text-bold" style = {{marginTop: '24px', marginBottom: '4px'}}>
                            Can you drive?
                        </h5>
                        <NewHasCar hasCar={hasCar} setHasCar={setHasCar}/>
                        <h5 id="regular-text-bold" style = {{marginTop: '24px', marginBottom: 5}}>
                            What is your general availability?
                        </h5>
                        <CheckForm obj={availabilityChecked} setObj={setAvailabilityChecked}/>
                        <Details fields={fields.details} handleFieldChange={handleFieldChange}/>
                        <Button style={{marginTop: 30}}
                                id="large-button-empty"
                                onClick={goToThirdPage}>Next</Button>
                        <p id="pagenum-text">Page 2 of 3</p>
                        <Toast
                            show={showToast}
                            delay={3000}
                            onClose={() => setShowToast(false)}
                            autohide
                            id='toastError'>
                            <Toast.Body>{toastMessage}</Toast.Body>
                        </Toast>
                    </Modal.Body>
                </Modal>
            )
        } else {
            return (
                <Modal show={props.showModal} onHide={() => {props.hideModal(); setPageNum(1);}} 
                       id='showRequestModal' style={{marginTop: 10, paddingBottom: 20}}>
                    <Modal.Header closeButton>
                        <Modal.Title id="small-header">Almost Done!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={newHandleSubmit}>
                            <h5 id="regular-text-bold" style = {{marginTop: 0, marginBottom: 4}}>
                                Here are your closest neighborhoods
                            </h5>
                            <p id="regular-text" style={{marginBottom: 4, fontSize: 14}}>
                                If these neighborhoods seem unfamiliar, please change your location before registering
                            </p>
                            <CheckForm obj={neighborhoodsChecked} setObj={setNeighborhoodsChecked}/>
                            <SelectionForm associations={props.state.associations} setState={props.setState} currentAssoc={props.state.currentAssoc}/>
                            <h5 id="regular-text-bold" style = {{marginTop: 20, marginBottom: 4}}>
                                Health
                            </h5>
                            <p id="regular-text" style={{marginBottom: 20, fontSize: 14}}>
                                For the your safety and the safety of all community members, please check 
                                the boxes to complete the volunteer pledge. If you have any questions about 
                                any of the choices, do not fill out the form and contact us at covaidco@gmail.com
                            </p>
                            <Row>
                                <Col md={12}>
                                    {terms.map((term) => {
                                        return <Form.Check key={term} 
                                                        type = "checkbox" 
                                                        id="regular-text"
                                                        label = {termSentences[term]}
                                                        onChange = {(evt) => { handleTermChange(evt, term) }}
                                                        checked = {currentTerms[term]} 
                                                        style = {{fontSize: 12, color: 'black', marginTop: 2}}/>
                                    })}
                                </Col>
                            </Row>
                            <ReCAPTCHA
                                sitekey="6LeZmeQUAAAAALo6YR9A7H-f7EZsYj3c0KJ189Ev"
                                onChange={() => {setCaptcha(true)}}
                                style = {{marginBottom: 0, marginTop: 20}}
                            />
                            <Button id="large-button" style={{marginTop: 15}} type="submit">Sign up!</Button>
                        </Form>
                        <p id="pagenum-text">Page 3 of 3</p>
                        <Toast
                            show={showToast}
                            delay={3000}
                            onClose={() => setShowToast(false)}
                            autohide
                            id='toastError'>
                            <Toast.Body>{toastMessage}</Toast.Body>
                        </Toast>
                    </Modal.Body>
                </Modal>
            )
        }
    } else {
        return (
            <Modal show={justRegistered} onHide={() => {setJustRegistered(false); setPageNum(1); props.hideModal();}}>
                <Modal.Header closeButton>
                    <Modal.Title id="small-header">Check your email for a verification link!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id="regular-text">
                        Once verified, you will be able to post an offer to support your 
                        community directly from your volunteer portal.
                    </p>
                    <Button id="large-button" onClick={() => {setJustRegistered(false); setPageNum(1); props.hideModal();}}>
                        Return to home
                    </Button>
                </Modal.Body>
            </Modal>
        );
    }
}