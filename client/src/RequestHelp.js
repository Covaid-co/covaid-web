import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
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
        last: "",
        details: "",
        email: "",
        phone: ""
    });

    const languages = ['English', 'Chinese', 'French', 'Spanish', 'Italian'];
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
    const [time, setTime] = useState('')
    const [date, setDate] = useState('')

    useEffect(() => {
        var url = "/api/association/get_assoc/lat_long?";
        let params = {
            'latitude': props.state.latitude,
            'longitude': props.state.longitude,
        }
        let query = Object.keys(params)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&');
        url += query;
    
        async function fetchData() {
            const response = await fetch(url);
            response.json().then((data) => {
                var resourcesFromAssoc = defaultResources
                if (data[0]) {
                    resourcesFromAssoc = data[0].resources
                }
                
                var tempAssoc = {}

                for (var i = 0; i < resourcesFromAssoc.length; i++) {
                  tempAssoc[resourcesFromAssoc[i]] = false
                }
                console.log(tempAssoc)
                setResources(tempAssoc)
            });
        }
        fetchData();
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
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
            'requester_last': fields.last,
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
        };
        console.log(form)
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

    if (firstPage) {
        return (
            <Modal show={props.state.showRequestHelp} onHide={props.hideRequestHelp} id='showRequestModal'>
                <Modal.Header closeButton>
                    <Modal.Title>Make a request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id="requestCall">
                        For those who would rather call in a request, 
                        please call <p id="phoneNumber">(401) 526-8243</p>
                    </p>
                    <h5 className="titleHeadings">Personal Information</h5>
                    <Row>
                        <Col xs={6} style = {{paddingRight: '4px'}}>
                            <Form.Group controlId="first" bssize="large">
                                <Form.Control value={fields.first} onChange={handleFieldChange} placeholder="First Name" />
                            </Form.Group>
                        </Col>
                        <Col xs={6} style = {{paddingLeft: '4px'}}>
                            <Form.Group controlId="last" bssize="large">
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
                    </Row>
                    <NewTasks resources={resources} setResources={setResources}/>
                    <Button id="nextPage" onClick={() => setFirstPage(false)}>Next</Button>
                    <p id="pageNumber">Page 1 of 2</p>
                </Modal.Body>
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
                        <NewPaymentMethod setSelectedIndex={setSelectedIndex}/>
                        <NewDetails fields={fields} handleFieldChange={handleFieldChange}/>
                        <Button id="nextPage" onClick={handleSubmit}>Submit a Request</Button>
                        <p id="pageNumber">Page 2 of 2</p>
                    </Modal.Body>
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
                            from a matched volunteer to help you.
                        </p>
                        <Button id="nextPage" onClick={() => {setCompleted(false); props.hideRequestHelp(); setFirstPage(true);}}>Return to home</Button>
                    </Modal.Body>
                </Modal>
            )
        }
    }
}