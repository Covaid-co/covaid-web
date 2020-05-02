import React, { useState, useEffect } from 'react';
import { useFormFields } from "./libs/hooksLib";
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Toast from 'react-bootstrap/Toast'

import NeededBy from './components_homepage/NeededBy';
import NewPaymentMethod from './components_homepage/NewPaymentMethod';
import NewDetails from './components_homepage/NewDetails';
import PhoneNumber from './components/PhoneNumber';
import CheckForm from './components/CheckForm';
import { defaultResources, languages, toastTime } from './constants'
import { validateEmail, extractTrueObj, setFalseObj } from './Helpers';

export default function RequestHelp(props) {

    const [fields, handleFieldChange] = useFormFields({
        first: "",
        details: "",
        email: "",
        phone: ""
    });

    const [resources, setResources] = useState({
        'Food/Groceries': false, 
        'Medication': false, 
        'Emotional Support': false, 
        'Donate': false, 
        'Academic/Professional': false,
        'Misc.': false
    });

    const [phoneNumber, setPhoneNumber] = useState('');
    const [languageChecked, setLanguageChecked] = useState({});
    const [firstPage, setFirstPage] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [selectedPayment, setSelectedIndex] = useState(0);
    const [time, setTime] = useState('Morning');
    const [date, setDate] = useState(new Date(Date.now()).toLocaleString().split(',')[0])
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [pendingSubmit, setPendingSubmit] = useState(false);

    useEffect(() => {
        setLanguageChecked(setFalseObj(languages));
        function fetchResources() {
            var resourcesFromAssoc = defaultResources;
            if (props.volunteer && props.requestHelpMode === "bulletin") {
                resourcesFromAssoc = props.volunteer.offer.tasks;
            } else if (Object.keys(props.state.currentAssoc).length > 0) {
                resourcesFromAssoc = props.state.currentAssoc.resources;
            }
            var tempAssoc = setFalseObj(resourcesFromAssoc);
            setResources(tempAssoc);
        }
        fetchResources();
    }, [props.requestHelpMode, props.volunteer, props.state.currentAssoc]);


    const checkFirstPageInput = () => {
        var valid = true;
        const phoneOnlyDigits = phoneNumber.replace(/\D/g,'').substring(0,10);
        if (fields.first.length === 0) {
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

        if (valid === false) {
            setShowToast(true);
        }
        return valid;
    }

    const goToSecondPage = () => {
        if (checkFirstPageInput()) {
            setFirstPage(false);
            setShowToast(false)
        }
    }

    const checkSecondPageInput = () => {
        if (Object.values(languageChecked).every(v => v === false)) {
            setShowToast(true);
            setToastMessage('No language selected');
            return false;
        }

        if (fields.details.length === 0) {
            setShowToast(true);
            setToastMessage('Enter details about your request');
            return false;
        }
        return true;
    }

    const handleSubmit = async e => {
        e.preventDefault();
        if (checkSecondPageInput() === false) {
            return;
        }
        setPendingSubmit(true)

        const resource_request = extractTrueObj(resources);
        const languages = extractTrueObj(languageChecked);

        var assoc_id = (props.state.currentAssoc._id && props.state.currentAssoc._id.length > 0) 
                        ? props.state.currentAssoc._id : "5e88cf8a6ea53ef574d1b80c";

        let form = {
            'requester_first': fields.first,
            'requester_phone': phoneNumber,
            'requester_email': fields.email,
            'details': fields.details,
            'payment': selectedPayment,
            'resource_request': resource_request,
            'languages': languages,
            'association': assoc_id,
            'time': time,
            'date': date,
            'latitude': props.state.latitude,
            'longitude': props.state.longitude,
            'volunteer': props.volunteer,
            'status': "pending"
        };
        // console.log(form)
        fetch('/api/request/create_request', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })
        .then((response) => {
            if (response.ok) {
                console.log("Request successfully created");
                setCompleted(true);
                setPendingSubmit(false)
                fields.details = '';
                fields.phone = '';
                fields.email = '';
            } else {
                console.log("Request not successful")
            }
        })
        .catch((e) => {
            console.log("Error");
        });
    }

    var general = "";
    if (props.requestHelpMode === "general") {
        general = "general "
    }

    var payment = <></>
    if (props.state.currentAssoc.name !== "Pittsburgh Mutual Aid") {
        payment = <NewPaymentMethod setSelectedIndex={setSelectedIndex}/>
    }

    var agreement = <></>
    var paymentAgreement = <></>
    if (props.state.currentAssoc.name === "Baltimore Mutual Aid") {
        agreement = <>
                    <Form.Check
                        type = "checkbox" 
                        id="regular-text"
                        label = "This match program is being organized by private citizens for the 
                            benefit of those in our community. By completing the sign up form to be 
                            matched, you agree to accept all risk and responsibility and further 
                            hold any facilitator associated with Baltimore Mutual Aid Network and/or 
                            Covaid.co harmless. For any additional questions, please contact bmoremutualaid@gmail.com."
                        style = {{fontSize: 12, marginTop: 2}}/>

                    </>
        paymentAgreement = <p id="regular-text" style = {{fontSize: 14}}>
            Baltimore Mutual Aid is not able to provide financial assistance at this time. Any purchases made by volunteers must be reimbursed.
                            </p>
    }

    const requestHeaderText = () => {
        var chosenText = 'After submitting a general request for support, we will attempt to match you with the best volunteer in your area.'
        if (props.requestHelpMode === 'bulletin') {
            chosenText = 'After submitting a direct request, your volunteer will reach out to you shortly! If you have any problems, please contact covaidco@gmail.com'
        }
        return chosenText;
    }

    const foundPhoneNumber = () => {
        if (Object.keys(props.state.currentAssoc).length > 0) {
            return props.state.currentAssoc.phone;
        }
        return '(401) 526-8243';
    }

    const resetState = () => {
        setTimeout(function () {
            setShowToast(false);
            setToastMessage('');
            setFirstPage(true)
        }, 700);
    }

    if (firstPage) {
        return (
            <Modal show={props.showModal} onHide={() => {props.hideModal(); resetState();}} className='showRequestModal' style={{marginTop: 10, paddingBottom: 20}}>
                <Modal.Header closeButton>
                    <Modal.Title id="small-header">Submit a {general}request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id="regular-text" style={{marginBottom: 0, paddingBottom: 0, borderBottom: '0px solid'}}>
                        {requestHeaderText()}
                    </p>
                    <p id="request-calling"> For those who would rather call in a request, 
                        please call <br /><span id="phoneNumber">{foundPhoneNumber()}</span></p>
                    <h5 id="regular-text-bold">Personal Information</h5>
                    <Row>
                        <Col xs={12}>
                            <Form.Group controlId="first" bssize="large">
                                <Form.Control value={fields.first} onChange={handleFieldChange} placeholder="Name" />
                            </Form.Group>
                        </Col>
                        <Col xs={12}>
                            <PhoneNumber phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} placeholder={"Phone"}/>
                        </Col>
                        <Col xs={12}>
                            <Form.Group controlId="email" bssize="large">
                                <Form.Control value={fields.email} onChange={handleFieldChange} placeholder="Email" />
                            </Form.Group>
                            <p id="regular-text" style={{fontStyle: 'italic', marginTop: 0, fontSize: 14}}>
                                Please enter either an email or a phone number.
                            </p>
                        </Col>
                    </Row>
                    <h5 id="regular-text-bold" style = {{marginTop: 0, marginBottom: 5}}>What support do you need?</h5>
                    <CheckForm obj={resources} setObj={setResources}/>
                    <Button id="large-button" style={{marginTop: 15}} onClick={goToSecondPage}>Next</Button>
                    <p id="pagenum-text">Page 1 of 2</p>
                    <Toast show={showToast} delay={toastTime} onClose={() => setShowToast(false)} autohide id='toastError'>
                        <Toast.Body>{toastMessage}</Toast.Body>
                    </Toast>
                </Modal.Body>
            </Modal>
        )
    } else {
        if (completed === false) {
            return (
                <Modal show={props.showModal} onHide={() => {props.hideModal(); resetState();}} id="showRequestModal" style={{marginTop: 10, paddingBottom: 20}}>
                    <Modal.Header closeButton>
                        <Modal.Title id="small-header">Almost Done!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5 id="regular-text-bold" style = {{marginTop: 0, marginBottom: 0}}>What language do you speak?</h5>
                        <p id="regular-text" style={{marginBottom: 0}}>
                            If language not listed, please mention in details section below
                        </p>
                        <CheckForm obj={languageChecked} setObj={setLanguageChecked}/>
                        <NeededBy setTime={setTime} setDate={setDate}/>
                        {payment}
                        {paymentAgreement}
                        <NewDetails fields={fields} handleFieldChange={handleFieldChange}/>
                        {agreement}
                        <Button disabled={pendingSubmit} id="large-button" style={{marginTop: 15}} onClick={handleSubmit}>Submit a Request</Button>
                        <p id="pagenum-text">Page 2 of 2</p>
                        <Toast show={showToast} delay={toastTime} onClose={() => setShowToast(false)} autohide id='toastError'>
                            <Toast.Body>{toastMessage}</Toast.Body>
                        </Toast>
                    </Modal.Body>
                </Modal>
            )
        } else {
            return (
                <Modal show={completed} onHide={() => {setCompleted(false); props.hideModal(); resetState();}} id="showRequestModal">
                    <Modal.Header closeButton>
                        <Modal.Title>Your request has been sent!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p id="regular-text" style={{marginBottom: 5}}>
                            Your request has been saved and you should receive an email soon 
                            from a matched volunteer who can support you.
                        </p>
                        <Button id="large-button" style={{marginTop: 15}} onClick={() => {setCompleted(false); props.hideModal(); resetState();}}>
                            Return to home
                        </Button>
                    </Modal.Body>
                </Modal>
            )
        }
    }
}