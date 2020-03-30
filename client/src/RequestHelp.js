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
    const [resources, setResources] = useState({});
    const [phoneNumber, setPhoneNumber] = useState('');
    const [languageChecked, setLanguageChecked] = useState({});
    const [firstPage, setFirstPage] = useState(true);
    const [selectedPayment, setSelectedIndex] = useState(0);

    useEffect(() => {
        var tempList = defaultResources;
        if (props.state.currentAssoc && Object.keys(props.state.currentAssoc).length != 0) {
            tempList = props.state.currentAssoc.resources;
        };

        for (var i = 0; i < tempList.length; i++) {
            const curr = tempList[i];
            setResources(prev => ({ 
                ...prev,
                [curr]: false,
            }));
        }
    }, [props.state.currentAssoc]);

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
                    </Row>
                    <NewTasks resources={resources} setResources={setResources}/>
                    <Button id="nextPage" onClick={() => setFirstPage(false)}>Next</Button>
                    <p id="pageNumber">Page 1 of 2</p>
                </Modal.Body>
            </Modal>
        )
    } else {
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
                    <NeededBy/>
                    <NewPaymentMethod setSelectedIndex={setSelectedIndex}/>
                    <NewDetails fields={fields} handleFieldChange={handleFieldChange}/>
                    <Button id="nextPage">Submit a Request</Button>
                    <p id="pageNumber">Page 2 of 2</p>
                </Modal.Body>
            </Modal>
        )
    }
}