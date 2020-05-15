import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import VolunteerDetails from './VolunteerDetails';
import { useFormFields } from "../libs/hooksLib";
import { formatName, distance, updateAllRequests } from './OrganizationHelpers';
import { volunteer_status } from '../constants';
import { toastTime } from '../constants';

/**
 * Finding best matches for a request
 */

export default function BestMatches(props) {
    const [bestMatchVolunteer, setBestMatchVolunteer] = useState(false);
    const [displayedVolunteers, setDisplayedVolunteers] = useState([]);
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
        const found_volunteers = strictMatch();
        found_volunteers.sort(function(a, b) {
            return distance(a, props.currRequest) - distance(b, props.currRequest)
        })
        setDisplayedVolunteers(found_volunteers.slice(0, 20));
        var checkboxStatusConstructionNoTasks = {};
        props.volunteers.forEach(
            function(volunteer) { 
                checkboxStatusConstructionNoTasks[volunteer._id] = false;
            }
        );
        setCheckboxStatus(checkboxStatusConstructionNoTasks);
    }, [props.currRequest]);

    const strictMatch = () => {
        const needed_resources = props.currRequest.request_info ? props.currRequest.request_info.resource_request : [];
        return props.volunteers.filter(volunteer => volunteer.offer.tasks.some(item => needed_resources.includes(item)))
    }

    const clearCheckBox = () => {
        var temp_checkbox = JSON.parse(JSON.stringify(checkboxStatus));
        displayedVolunteers.forEach(
            function(volunteer) { 
                temp_checkbox[volunteer._id] = false;
            }
        );
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

    // Display if volunteer was previously matched
    const displayPrevMatched = (volunteer) => {
        const volunteers = props.currRequest.status.volunteers;
        const found = volunteers.find(vol => {
            return volunteer._id === vol.volunteer && vol.current_status === volunteer_status.REJECTED;
        });

        if (found) {
            return <h5 id="association-name" style={{color: '#FF4133'}}>
                    Previously Matched
                </h5>
        }
        return <></>;
    }

    const sortSelectedTask = (x, y) => {
        const validX = props.currRequest && props.currRequest.request_info
                    && props.currRequest.request_info.resource_request.length > 0
                    && props.currRequest.request_info.resource_request.indexOf(x) !== -1;
        
        const validY = props.currRequest && props.currRequest.request_info
                    && props.currRequest.request_info.resource_request.length > 0
                    && props.currRequest.request_info.resource_request.indexOf(y) !== -1;
        return (validX === validY) ? 0 : validX ? -1 : 1;
    }

    // Resource's that match between requester and volunteer
    const displayResourceMatch = (volunteer) => {
        if (volunteer.offer.tasks.length === 0) {
            return <Badge id='task-info' style={{background: '#AE2F2F'}}>
                    No tasks entered
                </Badge>
        } else { 
            var tasks = volunteer.offer.tasks;
            tasks.sort(sortSelectedTask);
            return tasks.map((task, i) => {
                if (props.currRequest
                    && props.currRequest.request_info
                    && props.currRequest.request_info.resource_request.length > 0
                    &&  props.currRequest.request_info.resource_request.indexOf(task) !== -1) {
                    return <Badge key={i} style={{background: '#2670FF'}} id='task-info'>{task}</Badge>
                } else {
                    return <Badge key={i} style={{background: '#cadaff'}} id='task-info'>{task}</Badge>
                }
            });
        }
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

    return (<>
        <Modal show={props.topMatchesModal} onHide={closePage} style = {{marginTop: 5, paddingBottom: 40}}>
            <Modal.Body style={{zoom: '90%'}}>
                <Row style={{marginTop: 0}}>
                   <Col xs="12" style = {{marginTop: 0, marginBottom: 0}}>
                        <Modal.Title>{formatName(props.currRequest.personal_info.requester_name)}'s Top Matches 
                        <Button variant="link" id="regular-text" style={{color: '#2670FF', padding: 0, fontSize: 15, marginTop: 6, float: 'right'}} 
                            onClick={()=>{setSelectedVolunteers([]); clearCheckBox()}}>Unselect All</Button>
                        </Modal.Title>
                        <p id="requestCall" style={{marginTop: -15, marginBottom: 0}}>&nbsp;</p>
                    </Col>
                    <Col xs="12" id="col-scroll">
                        <ListGroup variant="flush">
                            {displayedVolunteers.map((volunteer, i) => {
                                if (volunteer.availability) {
                                return (
                                <ListGroup.Item key={i} style={{padding: 0}}>
                                    <Row>
                                        <Col lg={1} md={1}>
                                            <Form.Check type="checkbox" style={{marginTop: 35}} id='default-checkbox'
                                                checked={checkboxStatus[volunteer._id]}
                                                onChange={() => handleCheckboxAction(volunteer)}/>
                                        </Col>
                                        <Col id="best-match-item" lg={11} md={11} onClick={() => handleVolunteerClick(volunteer)}>
                                            <div>
                                                <h5 id="volunteer-name" style={{marginBottom: 0}}>
                                                    {volunteer.first_name} {volunteer.last_name}
                                                </h5>
                                                {displayPrevMatched(volunteer)}
                                            </div>
                                            <div>
                                                <p id="volunteer-location">{volunteer.offer.neighborhoods.join(', ')}</p>
                                                <p id="volunteer-location" style={{float: 'right', marginTop: -25, marginRight: 10}}>
                                                    {distance(volunteer, props.currRequest)} miles
                                                </p>
                                            </div>
                                            <div>
                                                {displayResourceMatch(volunteer)}
                                            </div>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>);
                            }})}
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
                                if (volunteer.availability) {
                                return (
                                <ListGroup.Item key={i} action onClick={() => handleVolunteerClick(volunteer)}>
                                    <div>
                                        <h5 id="volunteer-name" style={{marginBottom: 0}}>
                                            {volunteer.first_name} {volunteer.last_name}
                                        </h5>
                                        {displayPrevMatched(volunteer)}
                                    </div>
                                    <div>
                                        <p id="volunteer-location">{volunteer.offer.neighborhoods.join(', ')}</p>
                                        <p id="volunteer-location" style={{float: 'right', marginTop: -25, marginRight: 10}}>
                                            {distance(volunteer, props.currRequest)} miles
                                        </p>
                                    </div>
                                    <div>
                                        {displayResourceMatch(volunteer)}
                                    </div>
                                </ListGroup.Item>);
                            }})}
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
    currRequest: PropTypes.object,
    topMatchesModal: PropTypes.bool,
    volunteers: PropTypes.array,
    setTopMatchesModal: PropTypes.func,
    setRequestDetailsModal: PropTypes.func,
    setCurrRequest: PropTypes.func,
    setAllRequests: PropTypes.func,
    allRequests: PropTypes.array
};