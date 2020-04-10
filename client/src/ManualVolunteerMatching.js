import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Toast from 'react-bootstrap/Toast'
import { useFormFields } from "./libs/hooksLib";
import { validateEmail, moveFromToArr } from './Helpers';
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
                const newRequest = {
                    ...props.currRequest,
                    'status': {
                        'current_status': 'in_progress',
                        'volunteer': 'manual'
                    }
                }
                props.setCurrRequest(newRequest);
                moveFromToArr(newRequest, props.unmatched, props.setUnmatched, props.matched, props.setMatched);
                props.setTopMatchesModal(false);
                props.setRequestDetailsModal(false);
                props.setManualModal(false);
            } else { 
                alert("unable to attach");
            }
        }).catch((e) => {
            alert('could not attach');
        });
    }

    return (
        <Modal id="volunteer-details-matching" show={props.manualModal} onHide={() => props.setManualModal(false)} style = {{marginTop: 80}}>
            <Modal.Header closeButton>
                <Modal.Title>Manual Volunteer Entry</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{paddingLeft: 24}}>
                <Form onSubmit={matchVolunteer}>
                    <p id="request-info" style={{marginBottom: 10}}>Enter volunteer information for manual matching</p>
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
                            <PhoneNumber phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} placeholder="Phone"/>
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
                    <Button id="nextPage" type="submit" style={{marginTop: 8}}>Manually match with volunteer</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}