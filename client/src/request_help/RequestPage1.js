import React, { useState, useEffect } from "react";
import { useFormFields } from "../libs/hooksLib";
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Toast from 'react-bootstrap/Toast'

import PhoneNumber from '../components/PhoneNumber';
import CheckForm from '../components/CheckForm';
import { defaultResources, toastTime } from '../constants'
import { validateEmail, setFalseObj, extractTrueObj } from '../Helpers';

/**
 * Request support (Page 1)
 */

export default function RequestPage1(props) {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [resources, setResources] = useState({});
    const [fields, handleFieldChange] = useFormFields({
        name_request: "",
        email: ""
    });

    useEffect(() => {
        var resourcesFromAssoc = defaultResources;
        if (props.currentAssoc && Object.keys(props.currentAssoc).length > 0) {
            resourcesFromAssoc = props.currentAssoc.resources;
        }
        var tempAssoc = setFalseObj(resourcesFromAssoc);
        setResources(tempAssoc);
    }, [props.currentAssoc]);


    const goToSecondPage = () => {
        const valid = checkPage();
        if (valid) {
            setShowToast(false);
            const resource_request = extractTrueObj(resources);
            const result = {
                'phone': phoneNumber,
                'name': fields.name_request,
                'email': fields.email,
                'resources': resource_request
            }
            console.log(result)
            props.setFirstPage(result);
        } else {
            setShowToast(true);
        }
    }

    const checkPage = () => {
        var valid = true;
        const phoneOnlyDigits = phoneNumber.replace(/\D/g,'').substring(0,10);
        if (fields.name_request.length === 0) {
            setToastMessage('Enter a first name');
            valid = false;
        } else if (phoneOnlyDigits.length === 0 && fields.email.length === 0) {
            setToastMessage('Enter contact information');
            valid = false;
        } else if (phoneOnlyDigits.length !== 0 && phoneOnlyDigits.length !== 10 && validateEmail(fields.email) === false) {
            setToastMessage('Enter a valid contact information');
            valid = false;
        } else if (Object.values(resources).every(v => v === false)) {
            setToastMessage('No task selected');
            valid = false;
        }
        return valid;
    }


    return (
        <>
            <h5 id="regular-text-bold">{props.translations[props.language].personalInformation}</h5>
            <Row>
                <Col xs={12}>
                    <Form.Group controlId="name_request" bssize="large">
                        <Form.Control value={fields.name_request} onChange={handleFieldChange} placeholder={props.translations[props.language].name} />
                    </Form.Group>
                </Col>
                <Col xs={12}>
                    <PhoneNumber phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} placeholder={props.translations[props.language].phone}/>
                </Col>
                <Col xs={12}>
                    <Form.Group controlId="email" bssize="large">
                        <Form.Control value={fields.email} onChange={handleFieldChange} placeholder={props.translations[props.language].phone} />
                    </Form.Group>
                    <p id="regular-text" style={{fontStyle: 'italic', marginTop: 0, fontSize: 14}}>
                        {props.translations[props.language].emailOrPhone}.
                    </p>
                </Col>
            </Row>
            {props.currentAssoc === null ? <></> :
            <><h5 id="regular-text-bold" style = {{marginTop: 0, marginBottom: 5}}>{props.translations[props.language].whatSupport}?</h5>
            <CheckForm obj={resources} setObj={setResources} translations={props.translations} language={props.language}/></>}
            <Button id="large-button" style={{marginTop: 15}} onClick={goToSecondPage}>Next</Button>
            <p id="pagenum-text">Page 1 of 2</p>
            <Toast show={showToast} delay={toastTime} onClose={() => setShowToast(false)} autohide id='toastError'>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </>
    )
}

RequestPage1.propTypes = {
    setFirstPage: PropTypes.func,
    currentAssoc: PropTypes.object
};