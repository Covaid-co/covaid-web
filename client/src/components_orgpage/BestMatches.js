import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import VolunteerDetails from './VolunteerDetails'
import { calcDistance } from '../Helpers';
import { formatName } from './OrganizationHelpers';
import { volunteer_status } from '../constants';
import { toastTime } from '../constants';

/**
 * Finding best matches for a request
 */

export default function BestMatches(props) {

    const [bestMatchVolunteer, setBestMatchVolunteer] = useState(false);
    const [sortedVolunteers, setSortedVolunteers] = useState([]);
    const [displayedVolunteers, setDisplayedVolunteers] = useState([]);
    const [allVolunteersInOrg, setAllVolunteersInOrg] = useState([]);
    const [currVolunteer, setCurrVolunteer] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [looseMatch, setLooseMatch] = useState(false);
    const [checkboxStatus, setCheckboxStatus] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);

    useEffect(() => {
        var temp_volunteers = []
        var nomatch_volunteers = [];
        var needed_resources = props.currRequest.request_info ? props.currRequest.request_info.resource_request : [];
        var tempAllVolunteers = [];

        props.volunteers.forEach(
            function(volunteer) { 
                var volunteer_resources = volunteer.offer.tasks;
                if (volunteer_resources.some(item => needed_resources.includes(item))) {
                    temp_volunteers.push(volunteer)
                } else {
                    nomatch_volunteers.push(volunteer);
                }
                tempAllVolunteers.push(volunteer);
            }
        );
        tempAllVolunteers.sort(function(a, b) {
            return distance(a) - distance(b)
        })

        setAllVolunteersInOrg(tempAllVolunteers)
        temp_volunteers.sort(function(a, b) {
            return distance(a) - distance(b)
        });
        nomatch_volunteers.sort(function(a, b) {
            return distance(a) - distance(b);
        })
        var allVolunteers = temp_volunteers.concat(nomatch_volunteers);
        setSortedVolunteers(allVolunteers);
        setDisplayedVolunteers(allVolunteers.slice(0, 20));
        var checkboxStatusConstructionNoTasks = {};
        props.volunteers.forEach(
            function(volunteer) { 
                checkboxStatusConstructionNoTasks[volunteer._id] = false;
            }
        );
        setCheckboxStatus(checkboxStatusConstructionNoTasks);
        setIsLoaded(true);
    }, [props.currRequest]);

    const distance = (volunteer) => {
        const latA = volunteer.latitude;
        const longA = volunteer.longitude;
        const latB = props.currRequest.location_info.coordinates[1];
        const longB = props.currRequest.location_info.coordinates[0];
        const meters = calcDistance(latA, longA, latB, longB);
        const miles = meters * 0.00062137;
        return Math.round(miles * 100) / 100;
    }

    const closePage = () => {
        props.setTopMatchesModal(false);
        props.setRequestDetailsModal(true);
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

    if (!isLoaded) {
        return <></>;
    }

    const handleVolunteerClick = (volunteer) => {
        setCurrVolunteer({...volunteer});
        setBestMatchVolunteer(true);
    }

    const handleCheckboxAction = (id) => {
        var temp_checkbox = JSON.parse(JSON.stringify(checkboxStatus));
        temp_checkbox[id] = !checkboxStatus[id];
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
        console.log("submitting");
    }

    return (<>
        <Modal show={props.topMatchesModal} onHide={closePage} style = {{marginTop: 5, paddingBottom: 40}}>
            <Modal.Body style={{zoom: '90%'}}>
                <Row style={{marginTop: 0}}>
                   <Col xs="12" style = {{marginTop: 0, marginBottom: 5}}>
                        <Modal.Title>{formatName(props.currRequest.personal_info.requester_name)}'s Top Matches </Modal.Title>
                    </Col>
                    <Col xs="12" id="col-scroll">
                        <ListGroup variant="flush">
                            {displayedVolunteers.map((volunteer, i) => {
                                if (volunteer.availability) {
                                return (
                                <ListGroup.Item key={i} style={{padding: 0}}>
                                    <Row>
                                        <Col lg={1} md={1}>
                                            <Form.Check type="checkbox" style={{marginTop: 20}} id='default-checkbox' 
                                                checked={checkboxStatus[volunteer._id]}
                                                onChange={() => handleCheckboxAction(volunteer._id)}/>
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
                                                    {distance(volunteer)} miles
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
                        <p id="requestCall" style={{marginTop: -15, marginBottom: 5}}>&nbsp;</p>
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
                   <Col xs="12" style = {{marginTop: 0, marginBottom: 5}}>
                        <Modal.Title>Notify these volunteers? ({volunteerCount()})</Modal.Title>
                    </Col>
                    <Col xs="12" id="col-scroll">
                        <ListGroup variant="flush">
                            {displayedVolunteers.map((volunteer, i) => {
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
                                            {distance(volunteer)} miles
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
                        <p id="requestCall" style={{marginTop: -15, marginBottom: 5}}>&nbsp;</p>
                        <Button style={{marginTop: 10}} id="large-button" onClick={submitForm}>Confirm</Button>
                        <Button style={{marginTop: 5}} id="large-button-empty" onClick={closeConfirmPage}>Back</Button>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
        <VolunteerDetails show={bestMatchVolunteer} setBestMatchVolunteer={setBestMatchVolunteer}
                        currVolunteer={currVolunteer} { ... props } matching={true}/>
    </>)
}

BestMatches.propTypes = {
    currRequest: PropTypes.object,
    topMatchesModal: PropTypes.bool,
    volunteers: PropTypes.array,
    setTopMatchesModal: PropTypes.func,
    setRequestDetailsModal: PropTypes.func
};