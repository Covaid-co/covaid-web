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
import { generateURL } from '../Helpers';
import { useFormFields } from "../libs/hooksLib";
import { distance, updateAllRequests, filterVolunteers } from './OrganizationHelpers';
import { toastTime } from '../constants';
import { notifiedVolunteers, unSelectedVolunteers, volunteerListGroup, bestMatchesTitle,
        displayPrevMatched, displayResourceMatch, unselectButtonStyle } from './requestDetailsHelpers';

/**
 * Finding best matches for a request
 */

export default function BestMatches(props) {
    const [unselected_volunteers, setUnselectedVolunteers] = useState([]);
    const [filteredVolunteers, setFilteredVolunteers] = useState([]);
    const [notified_volunteers, setNotifiedVolunteers] = useState([]);
    const [strict, setStrict] = useState(true);
    const [currQuery, setQuery] = useState('');
    const [bestMatchVolunteer, setBestMatchVolunteer] = useState(false);
    const [currVolunteer, setCurrVolunteer] = useState({});
    const [checkboxStatus, setCheckboxStatus] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [sendModal, setSendModal] = useState(false);
    const [selectedVolunteers, setSelectedVolunteers] = useState([]);
    const [volunteer_count, setVolunteerCount] = useState(0);
    const [statistics, setStatistics] = useState();
    const [fields, handleFieldChange] = useFormFields({
        adminMessage: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const unselected = unSelectedVolunteers(props.currRequest, props.volunteers, strict);
        setUnselectedVolunteers(unselected);
        setFilteredVolunteers(unselected);
        const notified = notifiedVolunteers(props.currRequest, props.volunteers);
        setNotifiedVolunteers(notified);
        var temp_checkbox = {};
        unselected.forEach(
            function(volunteer) { 
                temp_checkbox[volunteer._id] = false;
            }
        );
        setCheckboxStatus(temp_checkbox);

        var list = []; //unselected.concat(notified); 
        for (var i = 0; i < unselected.length; i++) {
            list.push(unselected[i]._id); 
        }
        for (var i = 0; i < notified.length; i++) {
            list.push(notified[i]._id); 
        }
        console.log(list); console.log("all of them");

        fetch_statistics(list); 

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

    const handleCheckboxAction = (volunteer, event) => {
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

    const filterRequests = (e) => {
        e.persist();
        e.preventDefault();
        e.stopPropagation();
        var query = e.target.value.toLowerCase();
        setQuery(query);
        const filteredVolunteers = filterVolunteers(query, unselected_volunteers);
        setFilteredVolunteers(filteredVolunteers);
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
        setSubmitting(true);
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
            setSubmitting(false);
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
        setFilteredVolunteers(unselected);
        setQuery('');
        setStrict(!strict)
    }

    const displayFilteredVolunteers = () => {
        if (filteredVolunteers.length > 0) {  
            return filteredVolunteers.map(volunteer => 
                volunteerListGroup(volunteer, props.currRequest, handleVolunteerClick, statistics[volunteer._id], checkboxStatus, handleCheckboxAction))
        } else {
            return  <p id="regular-text" style={{textAlign: "center", marginTop: 20}}>
                            <strong>No matches, try broadening your search</strong> 
                    </p>
        }
    }

    const fetch_statistics = (id_list) => {
		let params = {'id_list': id_list};
		var url = generateURL( "/api/request/volunteerStatistics?", params);
		fetch(url).then((response) => {
            console.log(response)
            if (response.ok) {
                response.json().then(data => {
                    setStatistics(data) 
                });
            } else {
                console.log("Error")
            }
        }).catch((e) => {
            console.log(e)
        });
        //setStatistics(0)
	}

    return (<>
        <Modal show={props.topMatchesModal} onHide={closePage} style = {{marginTop: 5, paddingBottom: 40}}>
            <Modal.Body style={{zoom: '90%'}}>
                <Row style={{marginTop: 0}}>
                   <Col xs="12" style = {{marginTop: 0, marginBottom: 10}}>
                        <Modal.Title>{bestMatchesTitle(props.currRequest, props.mode)}
                        <Form style={{float: "right"}}>
                            <Form.Group controlId="preverify" bssize="large" style = {{marginBottom: 0, marginTop: 6}}>
                                <Form.Check type="switch"  id="custom-switch" style={{color: '#2670FF', fontSize: 14}}
                                    label={strict ? "Match on resource": "Match on resource"} checked={strict} onChange={changeStrict}/>
                            </Form.Group>
                        </Form>
                        </Modal.Title>
                    </Col>
                    <Col>
                        <Form>
                            <Form.Group bssize="large">
                                <Form.Control id="filter-requests" value={currQuery} placeholder="Search by name or neighborhood" onChange={filterRequests}/>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col xs="12">
                        <p id="requestCall" style={{marginTop: -15, marginBottom: 0}}>&nbsp;</p>
                    </Col>
                    <Col xs="12" id="col-scroll">
                        <ListGroup variant="flush">
                            {notified_volunteers.map(volunteer => volunteerListGroup(volunteer, props.currRequest, handleVolunteerClick, statistics[volunteer._id]))}
                            {displayFilteredVolunteers()}
                        </ListGroup>
                    </Col>
                    <Col xs="12">
                        <p id="requestCall" style={{marginTop: -20, marginBottom: 5}}>&nbsp;</p>
                        <Button variant="link" id="large-button" style={unselectButtonStyle(volunteerCount)} 
                        onClick={()=>{setSelectedVolunteers([]); clearCheckBox()}}>Unselect All</Button>
                        <Button style={{marginTop: 5}} id="large-button" onClick={confirmSelection}>Select {volunteerCount()} Volunteers</Button>
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
                        <Button disabled={submitting} style={{marginTop: 10}} id="large-button" onClick={submitForm}>Confirm</Button>
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