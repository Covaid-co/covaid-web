import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import VolunteerDetails from './VolunteerDetails';
import { useFormFields } from "../libs/hooksLib";
import { distance, updateAllRequests } from './OrganizationHelpers';
import { toastTime } from '../constants';
import { notifiedVolunteers, unSelectedVolunteers, volunteerListGroup, bestMatchesTitle,
        displayPrevMatched, displayResourceMatch, unselectButtonStyle } from './requestDetailsHelpers';

/**
 * Finding best matches for a request
 */

export default function BestMatches(props) {
    const [unselected_volunteers, setUnselectedVolunteers] = useState([]);
    const [notified_volunteers, setNotifiedVolunteers] = useState([]);
    const [strict, setStrict] = useState(true);

    const [bestMatchVolunteer, setBestMatchVolunteer] = useState(false);
    const [currVolunteer, setCurrVolunteer] = useState({});
    const [checkboxStatus, setCheckboxStatus] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [sendModal, setSendModal] = useState(false);
    const [selectedVolunteers, setSelectedVolunteers] = useState([]);
    const [volunteer_count, setVolunteerCount] = useState(0);
    const [fields, handleFieldChange] = useFormFields({
        adminMessage: ''
    });

    useEffect(() => {
        const unselected = unSelectedVolunteers(props.currRequest, props.volunteers);
        setUnselectedVolunteers(unselected);
        const notified = notifiedVolunteers(props.currRequest, props.volunteers);
        setNotifiedVolunteers(notified);
        var temp_checkbox = {};
        unselected.forEach(
            function(volunteer) { 
                temp_checkbox[volunteer._id] = false;
            }
        );
        setCheckboxStatus(temp_checkbox);
    }, [props.currRequest, props.volunteers]);

    const clearCheckBox = () => {
        var temp_checkbox = JSON.parse(JSON.stringify(checkboxStatus));
        for (const volunteer_id in temp_checkbox) {
            temp_checkbox[volunteer_id] = false;
        }
        setCheckboxStatus(temp_checkbox);
    }

    const closePage = () => {
        props.setTopMatchesModal(false);
        props.setRequestDetailsModal(true);
        setConfirmModal(false);
        setSelectedVolunteers([]);
        clearCheckBox();
    }

    const closeConfirmPage = () => {
        props.setTopMatchesModal(true);
        setConfirmModal(false);
    }

    const handleVolunteerClick = (volunteer) => {
        setCurrVolunteer({...volunteer});
        setBestMatchVolunteer(true);
    }

    const handleCheckboxAction = (volunteer) => {
        var volunteers = [];
        if (!checkboxStatus[volunteer._id]) {
            volunteers = selectedVolunteers.concat(volunteer);
        } else {
            volunteers = selectedVolunteers.filter(selectedVolunteer => selectedVolunteer._id !== volunteer._id);
        }
        volunteers.sort(function(a, b) { return distance(a, props.currRequest) - distance(b, props.currRequest) });
        setSelectedVolunteers(volunteers);

        var temp_checkbox = JSON.parse(JSON.stringify(checkboxStatus));
        temp_checkbox[volunteer._id] = !checkboxStatus[volunteer._id];
        setCheckboxStatus(temp_checkbox);
    }

    const volunteerCount = () => {
        return Object.values(checkboxStatus).reduce((a, item) => a + item, 0);
    }

    const confirmSelection = () => {
        if (volunteerCount() === 0) {
            setShowToast(true);
            return
        } else {
            props.setTopMatchesModal(false);
            setConfirmModal(true);
        }
    }

    const submitForm = () => {
        let form = {
            _id: props.currRequest._id,
            volunteers: selectedVolunteers.map(volunteer => volunteer._id),
            adminMessage: fields.adminMessage
        };

        fetch('/api/request/matchVolunteers', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => response.json())
        .then(newRequest => {
            props.setCurrRequest(newRequest);
            // Update all requests array with the new updated request
            const newAllRequests = updateAllRequests(newRequest, props.allRequests);
            props.setAllRequests(newAllRequests);

            setVolunteerCount(volunteerCount());
            props.setRequestDetailsModal(false);
            props.setTopMatchesModal(false);
            setConfirmModal(false);
            setSendModal(true);
        }).catch(e => {
            alert(e);
        });
    }

    const changeStrict = () => {
        const unselected = unSelectedVolunteers(props.currRequest, props.volunteers, !strict);
        setUnselectedVolunteers(unselected);
        setStrict(!strict)
    }

    return (<>
        <Modal show={props.topMatchesModal} onHide={closePage} style = {{marginTop: 5, paddingBottom: 40}}>
            <Modal.Body style={{zoom: '90%'}}>
                <Row style={{marginTop: 0}}>
                   <Col xs="12" style = {{marginTop: 0, marginBottom: 10}}>
                        <Modal.Title>{bestMatchesTitle(props.currRequest, props.mode)}
                        <Button variant="link" id="regular-text" style={unselectButtonStyle(volunteerCount)} 
                            onClick={()=>{setSelectedVolunteers([]); clearCheckBox()}}>Unselect All</Button>
                        </Modal.Title>
                    </Col>
                    <Col xs={9} style={{paddingRight: 0}}>
                        <Form>
                            <Form.Group bssize="large">
                                <Form.Control id="filter-requests" placeholder="Search by name or neighborhood"/>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col xs={3}>
                        <Form>
                            <Form.Group controlId="preverify" bssize="large" style = {{marginBottom: 0, marginTop: 6}}>
                                <Form.Check type="switch"  id="custom-switch" style={{color: '#2670FF', fontSize: 14}}
                                    label={strict ? "Strict": "Non-Strict"} checked={strict} onChange={changeStrict}/>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col xs="12">
                        <p id="requestCall" style={{marginTop: -15, marginBottom: 0}}>&nbsp;</p>
                    </Col>
                    <Col xs="12" id="col-scroll">
                        <ListGroup variant="flush">
                            {notified_volunteers.map(volunteer => volunteerListGroup(volunteer, props.currRequest, handleVolunteerClick))}
                            {unselected_volunteers.map(volunteer => 
                                volunteerListGroup(volunteer, props.currRequest, handleVolunteerClick, checkboxStatus, handleCheckboxAction))}
                        </ListGroup>
                    </Col>
                    <Col xs="12">
                        <p id="requestCall" style={{marginTop: -20, marginBottom: 5}}>&nbsp;</p>
                        <Button style={{marginTop: 10}} id="large-button" onClick={confirmSelection}>Select {volunteerCount()} Volunteers</Button>
                        <Button style={{marginTop: 5}} id="large-button-empty" onClick={closePage}>Back</Button>
                    </Col>
                </Row>
                <Toast show={showToast} delay={toastTime} onClose={() => setShowToast(false)} autohide id='toastError'>
                    <Toast.Body>Select a volunteer</Toast.Body>
                </Toast>
            </Modal.Body>
        </Modal>

        <Modal show={confirmModal} onHide={closeConfirmPage} style = {{marginTop: 5, paddingBottom: 40}}>
            <Modal.Body style={{zoom: '90%'}}>
                <Row style={{marginTop: 0}}>
                   <Col xs="12" style = {{marginTop: 0, marginBottom: 0}}>
                        <Modal.Title>Notify these volunteers? ({volunteerCount()})</Modal.Title>
                        <p id="requestCall" style={{marginTop: -15, marginBottom: 0}}>&nbsp;</p>
                    </Col>
                    <Col xs="12" id="col-scroll">
                        <ListGroup variant="flush">
                            {selectedVolunteers.map((volunteer, i) => {
                                return (
                                <ListGroup.Item key={i} action onClick={() => handleVolunteerClick(volunteer)}>
                                    <div>
                                        <h5 id="volunteer-name" style={{marginBottom: 0}}>
                                            {volunteer.first_name} {volunteer.last_name}
                                        </h5>
                                        {displayPrevMatched(volunteer, props.currRequest)}
                                    </div>
                                    <div>
                                        <p id="volunteer-location">{volunteer.offer.neighborhoods.join(', ')}</p>
                                        <p id="volunteer-location" style={{float: 'right', marginTop: -25, marginRight: 10}}>
                                            {distance(volunteer, props.currRequest)} miles
                                        </p>
                                    </div>
                                    <div>
                                        {displayResourceMatch(volunteer, props.currRequest)}
                                    </div>
                                </ListGroup.Item>);
                            })}
                        </ListGroup>
                    </Col>
                    <Col xs="12">
                        <p id="requestCall" style={{marginTop: -20, marginBottom: 5}}>&nbsp;</p>
                        <h5 id="regular-text-bold" style={{marginBottom: 5, marginTop: 16}}>
                            Share any relevant information with these volunteers (optional):
                        </h5>
                        <Form>
                            <Form.Group controlId="adminMessage" bssize="large">
                                <Form.Control as="textarea" rows="3" placeholder="Message to volunteer"
                                            value={fields.adminMessage ? fields.adminMessage : ''} 
                                            onChange={handleFieldChange}/>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col xs="12">
                        <Button style={{marginTop: 10}} id="large-button" onClick={submitForm}>Confirm</Button>
                        <Button style={{marginTop: 5}} id="large-button-empty" onClick={closeConfirmPage}>Back</Button>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>

        <Modal show={sendModal} onHide={() => {setSendModal(false); setSelectedVolunteers([]); clearCheckBox();}} size="sm">
            <Modal.Header closeButton>
                <Modal.Title>Request Sent!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p id="regular-text">
                    {volunteer_count} volunteers have been notified.
                </p>
                <Button id="large-button" onClick={() => {setSendModal(false); setSelectedVolunteers([]); clearCheckBox();}}>
                    Return to Dashboard
                </Button>
            </Modal.Body>
        </Modal>
        <VolunteerDetails { ... props } volunteerDetailModal={bestMatchVolunteer} setBestMatchVolunteer={setBestMatchVolunteer} 
                        setConfirmModal={setConfirmModal} currVolunteer={currVolunteer} matching={[props.topMatchesModal, confirmModal]} />
    </>)
}

BestMatches.propTypes = {
    mode: PropTypes.number,
    currRequest: PropTypes.object,
    topMatchesModal: PropTypes.bool,
    volunteers: PropTypes.array,
    setTopMatchesModal: PropTypes.func,
    setRequestDetailsModal: PropTypes.func,
    setCurrRequest: PropTypes.func,
    setAllRequests: PropTypes.func,
    allRequests: PropTypes.array
};