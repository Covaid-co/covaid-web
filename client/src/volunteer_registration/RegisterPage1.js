import React, { useState } from "react";
import { useFormFields } from "../libs/hooksLib";
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Toast from 'react-bootstrap/Toast'

import PhoneNumber from '../components/PhoneNumber';
import { toastTime } from '../constants'
import { validateEmail } from '../Helpers';
 
/**
 * Volunteer Registration (Page 1)
 */

export default function RegisterPage1(props) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [fields, handleFieldChange] = useFormFields({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "", 
        pronouns: ""
    });

    const goToSecondPage = () => {
        const valid = checkPage();
        if (valid) {
            setShowToast(false);
            var phoneString = phoneNumber.replace(/\D/g,'').substring(0,10);
            const result = { 
                'first_name': fields.first_name,
                'last_name': fields.last_name,
                'email': fields.email,
                'password': fields.password,
                'pronouns': fields.pronouns,
                'phone': phoneString
            }
            props.setFirstPage(result);
        } else {
            setShowToast(true);
        }
    }

    const checkPage = () => {
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

    return (
        <>
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
            <Toast show={showToast} delay={toastTime} onClose={() => setShowToast(false)} autohide id='toastError'>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </>
    )
}

RegisterPage1.propTypes = {
    setFirstPage: PropTypes.func
}