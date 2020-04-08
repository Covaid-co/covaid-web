import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Toast from 'react-bootstrap/Toast'
import { useFormFields } from "./libs/hooksLib";

import NewLanguages from './NewLanguages';
import NewTasks from './NewTasks';
import NeededBy from './NeededBy';
import NewPaymentMethod from './NewPaymentMethod';
import NewDetails from './NewDetails';
import PhoneNumber from './PhoneNumber';

export default function RequestHelp(props) {

    const [fields, handleFieldChange] = useFormFields({
        first: "",
        details: "",
        email: "",
        phone: ""
    });

    const [mode, setMode] = useState(props.requestHelpMode);

    const languages = ['English', 'Chinese', 'French', 'Spanish', 'Other'];
    const defaultResources = ['Food/Groceries', 'Medication', 'Emotional Support', 'Donate', 'Academic/Professional', 'Misc.'];
    const [resources, setResources] = useState(
        {'Food/Groceries': false, 
        'Medication': false, 
        'Emotional Support': false, 
        'Donate': false, 
        'Academic/Professional': false,
        'Misc.': false
        }
    );
    const [phoneNumber, setPhoneNumber] = useState('');
    const [languageChecked, setLanguageChecked] = useState({});
    const [firstPage, setFirstPage] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [selectedPayment, setSelectedIndex] = useState(0);
    const [time, setTime] = useState('Morning')
    const [date, setDate] = useState(new Date(Date.now()).toLocaleString().split(',')[0])
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        var url = "/api/association/get_assoc/lat_long?";
        setMode(props.requestHelpMode)
        setLanguageChecked({})
        let params = {
            'latitude': props.state.latitude,
            'longitude': props.state.longitude,
        }
        let query = Object.keys(params)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&');
        url += query;

        function fetchResources() {
            var resourcesFromAssoc;
            if (props.requestHelpMode === "bulletin") {
                resourcesFromAssoc = props.volunteer.offer.tasks
            } else {
                var data = props.state.associations
                resourcesFromAssoc = defaultResources
                if (data[0]) {
                    resourcesFromAssoc = data[0].resources
                }
            }
            var tempAssoc = {}
            for (var i = 0; i < resourcesFromAssoc.length; i++) {
                tempAssoc[resourcesFromAssoc[i]] = false
            }
            setResources(tempAssoc)
        }
        fetchResources();
    }, [props.requestHelpMode, props.volunteer]);


    const checkFirstPageInput = () => {
        if (fields.first.length === 0) {
            setShowToast(true);
            setToastMessage('Enter a first name');
            return false;
        }

        const phoneOnlyDigits = phoneNumber.replace(/\D/g,'').substring(0,10);
        if (phoneOnlyDigits.length === 0 && fields.email.length === 0) {
            setShowToast(true);
            setToastMessage('Enter contact information');
            return false;
        }

        if (Object.values(resources).every(v => v === false)) {
            setShowToast(true);
            setToastMessage('No task selected');
            return false;
        }
        return true;
    }

    const goToSecondPage = () => {
        if (checkFirstPageInput()) {
            setFirstPage(false);
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

        var resource_request = []
        Object.keys(resources).forEach(function(key) {
            if (resources[key]) {
                resource_request.push(key)
            }
        }); 
        var languages = []
        Object.keys(languageChecked).forEach(function(key) {
            if (languageChecked[key]) {
                languages.push(key)
            }
        });

        let form = {
            'requester_first': fields.first,
            'requester_phone': phoneNumber,
            'requester_email': fields.email,
            'details': fields.details,
            'payment': selectedPayment,
            'resource_request': resource_request,
            'languages': languages,
            'association': props.state.currentAssoc._id,
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
                        label = "This match program is being organized by private citizens for the benefit of those in our community. By completing the sign up form to be matched, you agree to accept all risk and responsibility and further hold any facilitator associated with Baltimore Mutual Aid Network and/or Covaid.co harmless. For any additional questions, please contact bmoremutualaid@gmail.com."
                        style = {{fontSize: 12, marginTop: 2}}/>

                    </>
        paymentAgreement = <p id="locationInfo">
            Baltimore Mutual Aid is not able to provide financial assistance at this time. Any purchases made by volunteers must be reimbursed.
                            </p>
    }

    if (firstPage) {
        return (
            <Modal show={props.state.showRequestHelp} onHide={props.hideRequestHelp} className='showRequestModal' style={{marginTop: 10}}>
                <Modal.Header closeButton>
            <Modal.Title>Submit a {general}request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id="requestCall" style={{marginBottom: 10, paddingBottom: 10}}>
                        After submitting a general request for support, we will attempt to match you with the best volunteer in your area.<br/>
                        <font style={{fontStyle: 'italic'}}> For those who would rather call in a request, 
                        please call <br /><span id="phoneNumber">(401) 526-8243</span>. </font>
                    </p>
                    <h5 className="titleHeadings">Personal Information</h5>
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
                            <p id="locationInfo">
                            Please enter either an email or a phone number.
                        </p>
                        </Col>
                    </Row>
                    <NewTasks resources={resources} setResources={setResources}/>
                    <Button id="nextPage" onClick={goToSecondPage}>Next</Button>
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
        )
    } else {
        if (completed === false) {
            return (
                <Modal show={props.state.showRequestHelp} onHide={() => {props.hideRequestHelp(); setFirstPage(true);}} id="showRequestModal">
                    <Modal.Header closeButton>
                        <Modal.Title>Almost Done!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5 className="titleHeadings" style = {{marginTop: '8px', marginBottom: '4px'}}>
                            What language do you speak?
                        </h5>
                        <p id="locationInfo">
                            If language not listed, please mention in details section below
                        </p>
                        <NewLanguages languages={languages} languageChecked={languageChecked} setLanguageChecked={setLanguageChecked}/>
                        <NeededBy setTime={setTime} setDate={setDate}/>
                        {payment}
                        {paymentAgreement}
                        <NewDetails fields={fields} handleFieldChange={handleFieldChange}/>
                        {agreement}
                        <Button id="nextPage" onClick={handleSubmit}>Submit a Request</Button>
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
        } else {
            return (
                <Modal show={completed} onHide={() => {setCompleted(false); props.hideRequestHelp(); setFirstPage(true);}} id="showRequestModal">
                    <Modal.Header closeButton>
                        <Modal.Title>Your request has been sent!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p id="locationInfo">
                            Your request has been saved and you should receive an email soon 
                            from a matched volunteer who can support you.
                        </p>
                        <Button id="nextPage" onClick={() => {setCompleted(false); props.hideRequestHelp(); setFirstPage(true);}}>Return to home</Button>
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                </Modal>
            )
        }
    }
}