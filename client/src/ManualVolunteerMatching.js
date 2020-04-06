import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Toast from 'react-bootstrap/Toast'
import { useFormFields } from "./libs/hooksLib";

import PhoneNumber from './PhoneNumber'

export default function ManualVolunteerMatching(props) {

    
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [fields, handleFieldChange] = useFormFields({
        email1: "",
        email: "",
        details: ""
    });

    const [phoneNumber, setPhoneNumber] = useState('');

    const checkFirstPageInput = () => {
        if (fields.email1.length === 0) {
            setShowToast(true);
            setToastMessage('Enter a first name');
            return false;
        }

        if (fields.email.length === 0 || 
            validateEmail(fields.email) === false) {
            setShowToast(true);
            setToastMessage('Enter a valid email');
            return false;
        }

        const phoneOnlyDigits = phoneNumber.replace(/\D/g,'').substring(0,10);
        if (phoneOnlyDigits.length !== 0 && phoneOnlyDigits.length !== 10) {
            setShowToast(true);
            setToastMessage('Enter a valid phone number');
            return false;
        }

        if (fields.details.length === 0) {
            setShowToast(true);
            setToastMessage('Enter details');
            return false;
        }
    }

    const matchVolunteer = async e => {
        e.preventDefault();
        e.stopPropagation();
        
        if (checkFirstPageInput() === false) {
            return;
        }

        const requester_id = props.currRequest._id;
        const phoneOnlyDigits = phoneNumber.replace(/\D/g,'').substring(0,10);
        let form = {
            'request_id': requester_id,
            'name': fields.email1,
            'email': fields.email,
            'details': fields.details,
            'phone': phoneOnlyDigits
        };

        fetch('/api/request/manual_volunteer', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                // console.log("attached");
                window.location.reload();
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            alert('could not attach');
        });
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    return (
        <Modal id="volunteer-details-matching" show={props.manualModal} onHide={() => props.setManualModal(false)} style = {{marginTop: 80}}>
            <Modal.Header closeButton>
                <Modal.Title>Manual Volunteer Entry</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={matchVolunteer}>
                    <p id="createAccountText">
                        Enter volunteer information for manual matching
                    </p>
                    <Row>
                        <Col xs={12}>
                            <Form.Group controlId="email1" bssize="large">
                                <Form.Control value={fields.email1} onChange={handleFieldChange} placeholder="Name" />
                            </Form.Group>
                        </Col>
                        <Col xs={12}>
                            <Form.Group controlId="email" bssize="large">
                                <Form.Control value={fields.email} onChange={handleFieldChange} placeholder="Email" />
                            </Form.Group>
                        </Col>
                        <Col xs={12}>
                            <PhoneNumber phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}/>
                        </Col>
                        <Col xs={12}>
                            <Form.Group controlId="details" bssize="large">
                                <Form.Control as="textarea" 
                                            rows="4"
                                            placeholder="Details about the volunteer/request"
                                            value={fields.details} 
                                            onChange={handleFieldChange}/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Toast
                        show={showToast}
                        delay={3000}
                        onClose={() => setShowToast(false)}
                        autohide
                        id='toastError'
                        style={{marginBottom: 70}}>
                        <Toast.Body>{toastMessage}</Toast.Body>
                    </Toast>
                    {/* <p id="request-info">Availabile to help: {props.currVolunteer.availability ? 'yes':'no'}</p>
                    <p id="request-info">Email: {props.currVolunteer.email}</p>
                    <p id="request-info">Phone: {props.currVolunteer.phone}</p>
                    <p id="request-info">Neighborhoods: {props.currVolunteer.offer ? props.currVolunteer.offer.neighborhoods.join(', ') : ""}
                    </p>
                    <p id="request-info">Languages: {props.currVolunteer.languages}</p>
                    <p id="request-info">Has car: 
                        {props.currVolunteer.offer ? (props.currVolunteer.offer.car ? ' yes': ' no') : ""}
                    </p>
                    <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Tasks:</h5>
                    {props.currVolunteer.offer ? props.currVolunteer.offer.tasks.map((task, i) => {
                        return <Badge key={i} className='task-info'>{task}</Badge>
                    }) : ""}
                    <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Details:</h5>
                    <p id="request-info"> {props.currVolunteer.offer ? props.currVolunteer.offer.details : ""}</p> */}
                    <Button id="nextPage" type="submit">Manually match with volunteer</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}