import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "./react-dates-override.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateRangePicker } from "react-dates";
import fetch_a from '../util/fetch_auth';
import { useFormFields } from "../libs/hooksLib";

import { setFalseObj } from '../Helpers';
import { defaultResources } from '../constants';
import CheckForm from '../components/CheckForm'
import NewHasCar from '../components_homepage/NewHasCar'
import VolunteerDetails from './VolunteerDetails'

export default function BeaconCreation(props) {

    const [selectedTasks, setSelectedTasks] = useState({});
    const [car, setCar] = useState(false);
    const [foundVolunteers, setFoundVolunteers] = useState([]);
    const [checkboxStatus, setCheckboxStatus] = useState({});

    const [pageNum, setPageNum] = useState(1);
    const [currVolunteer, setCurrVolunteer] = useState({});
    const [volunteerDetailModal, setVolunteerDetailsModal] = useState(false);
    
    const [beaconVolunteers, setBeaconVolunteers] = useState([]);
    const [fields, handleFieldChange] = useFormFields({
        name: "",
        message: ""
    });
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [focused, setFocused] = useState(null); // this will be removed

    useEffect(() => {
        if (props.association.resources) {
            setSelectedTasks(setFalseObj(props.association.resources));
        } else {
            setSelectedTasks(setFalseObj(defaultResources));
        }
    }, [props.association, props.volunteers]);

    const handleDatesChange = ({ startDate, endDate }) => {
        setStartDate(startDate);
        setEndDate(endDate);
    };

    const handleCheckboxAction = (id) => {
        var temp_checkbox = JSON.parse(JSON.stringify(checkboxStatus));
        temp_checkbox[id] = !checkboxStatus[id];
        setCheckboxStatus(temp_checkbox);
    }

    const findVolunteers = () => {
        var requiredTasks = [];
        for (var task in selectedTasks) {
            if (selectedTasks.hasOwnProperty(task)) {
                if (selectedTasks[task]) {
                    requiredTasks.push(task);
                }
            }
        }

        var filteredVolunteers = [];
        var checkboxStatusConstruction = {};
        props.volunteers.forEach(
            function(volunteer) { 
                var volunteer_tasks = volunteer.offer.tasks;
                if (volunteer_tasks.some(task => requiredTasks.includes(task)) && volunteer.preVerified && volunteer.availability) {
                    if (!car || volunteer.offer.car) {
                        filteredVolunteers.push(volunteer)
                        checkboxStatusConstruction[volunteer._id] = false;
                    }
                } 
            }
        );
        setFoundVolunteers(filteredVolunteers);
        setCheckboxStatus(checkboxStatusConstruction);
        setPageNum(2);
    }

    const createBeacon = () => {
        var volunteers = [];
        for (var volunteer in checkboxStatus) {
            if (checkboxStatus.hasOwnProperty(volunteer)) {
                if (checkboxStatus[volunteer]) {
                    volunteers.push(volunteer);
                }
            }
        }
        setBeaconVolunteers(volunteers);
        setPageNum(3);
    }

    function resetState() {
        setTimeout(function () {
            setSelectedTasks(props.association ? setFalseObj(props.association.resources) : setFalseObj(defaultResources));
            setCar(false);
            setPageNum(1);
        }, 1000);
    }

    const sendBeacon = () => {
        let form = {
            'beacon': {
                'beaconName': fields.name,
                'beaconMessage': fields.message,
                'volunteers': beaconVolunteers,
                'beaconStartDate': startDate.toDate(),
                'beaconEndDate': endDate.toDate()
            }
        }

        fetch_a('org_token', '/api/beacon/create', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })
            .then((response) => response.json())
                .then((body) => {
                    props.setBeaconModal(false);
                    props.pushBeacon(body.beacon);
                    resetState();
                })
                .catch((error) => {
                    console.error(error);
		});
    }


    if (pageNum === 1) {
        return(
            <>
                <Modal size="lg" show={props.beaconModal} onHide={() => {setPageNum(1); props.setBeaconModal(false)}} style = {{marginTop: 10, paddingBottom: 40}}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{marginLeft: 5}}>Create a Beacon</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{paddingTop: 0}}>
                        <div id='page1'>
                            <Col xs="12">
                                <p id="regular-text" style={{marginTop: 10, marginBottom: 10}}>Beacons are a way for you to reach out to your volunteers in mass.
                                Use the filters below and we'll curate the most optimal volunteers to get this done</p>
                                <h5 id="regular-text-bold" style = {{marginTop: 10, marginBottom: 5}}>
                                    What resources do you need from your volunteers?
                                </h5>
                                <CheckForm obj={selectedTasks} setObj={setSelectedTasks}/>
                                <h5 id="regular-text-bold" style = {{marginTop: 20, marginBottom: 5}}>
                                    Will they need a car?
                                </h5>
                                <NewHasCar hasCar={car} setHasCar={setCar}/>
                                <Button style={{marginTop: 20}}
                                    id="large-button"
                                    onClick={findVolunteers}
                                    >
                                        Find volunteers</Button>
                            </Col>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        );
    } else if (pageNum === 2) {
        return (
            <>
                <Modal size="md" show={props.beaconModal} onHide={() => {setPageNum(1); props.setBeaconModal(false)}} style = {{marginTop: 10, paddingBottom: 40}}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{marginLeft: 5}}>Create a Beacon</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{paddingTop: 0}}>
                        <div id='page2'>
                            <Row>
                                <Col xs="12">
                                    <div>
                                    <Row>
                                        <Col lg={11} md={11} style = {{marginTop: 10, marginBottom: 5}}>
                                            <h5 id="volunteer-name">
                                                Found {foundVolunteers.length} volunteers 
                                            </h5>
                                        </Col>
                                    </Row>
                                    </div>
                                    <ListGroup variant="flush" style={{overflowY: "scroll", height: 350}}>
                                        {foundVolunteers.map((volunteer, i) => {
                                            return (
                                            <ListGroup.Item key={i}>
                                                <Row>
                                                    <Col lg={1} md={1}>
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={checkboxStatus[volunteer._id]}
                                                            onChange={() => handleCheckboxAction(volunteer._id)}
                                                            style={{marginTop: 5}}
                                                            id='default-checkbox'
                                                        />
                                                    </Col>
                                                    <Col lg={11} md={11}>
                                                        <h5 id="volunteer-name">
                                                            {volunteer.first_name} {volunteer.last_name} 
                                                                <Button style={{backgroundColor: "Transparent", border: "none"}} onClick={() => {setCurrVolunteer({...volunteer});  setVolunteerDetailsModal(true);}}>
                                                                    <FontAwesomeIcon style={{color: "#2670FF"}} icon={faInfoCircle} /> 
                                                                </Button>
                                                        </h5>
                                                        <p id="volunteer-location">{volunteer.offer.neighborhoods.join(', ')}</p>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>);
                                        })}
                                    </ListGroup>
                                </Col>
                            </Row>
                            <Button style={{marginTop: 20}}
                                    id="large-button"
                                    onClick={createBeacon}
                                    >
                                        Almost done</Button>
                        </div>
                    </Modal.Body>
                    <VolunteerDetails volunteerDetailModal={volunteerDetailModal}
                                    setVolunteerDetailsModal={setVolunteerDetailsModal}
                                    currVolunteer={currVolunteer}
                                    />
                </Modal>
            </>
        );
    } else if (pageNum === 3) {
        return (
            <>
                <Modal size="md" show={props.beaconModal} onHide={() => {setPageNum(1); props.setBeaconModal(false)}} style = {{marginTop: 10, paddingBottom: 40}}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{marginLeft: 5}}>Create a Beacon</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{paddingTop: 0}}>
                        <div id='page2'>
                            <Row>
                                <Col>
                                    <h5 id="regular-text-bold" style = {{marginTop: 10, marginBottom: 5}}>Beacon name</h5>
                                    <Form>
                                        <Form.Group controlId="name" bssize="large" style={{marginTop: 0}}>
                                            <Form.Control
                                                        value={fields.name}
                                                        onChange={handleFieldChange}
                                                        placeholder='Ex: Week of 7/17 - Food Pantry Delivery'
                                                    />
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <h5 id="regular-text-bold" style = {{marginTop: 10, marginBottom: 5}}>Beacon message</h5>
                                    <Form>
                                        <Form.Group controlId="message" bssize="large" style={{marginTop: 0}}>
                                            <Form.Control as="textarea" 
                                                        rows="3"
                                                        value={fields.message}
                                                        onChange={handleFieldChange}
                                                        placeholder='Your selected volunteers will see this message'
                                                    />
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <h5 id="regular-text-bold" style = {{marginTop: 10, marginBottom: 10}}>Choose the duration of this beacon</h5>
                                    <div id="dates_button" style={{marginTop: 0}}>
                                        <DateRangePicker
                                            style={{fontSize: 13,
                                                    fontFamily: "Inter",
                                                    fontWeight: "bold"}}
                                            startDate={startDate}
                                            startDateId="tata-start-date"
                                            endDate={endDate}
                                            endDateId="tata-end-date"
                                            onDatesChange={handleDatesChange}
                                            focusedInput={focused}
                                            onFocusChange={focused => setFocused(focused)}
                                            hideKeyboardShortcutsPanel={true}
                                            regular={true}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Button style={{marginTop: 20}}
                                    id="large-button"
                                    onClick={sendBeacon}
                                    >
                                        Send your beacon</Button>
                        </div>
                    </Modal.Body>
                    <VolunteerDetails volunteerDetailModal={volunteerDetailModal}
                                    setVolunteerDetailsModal={setVolunteerDetailsModal}
                                    currVolunteer={currVolunteer}
                                    />
                </Modal>
            </>
        );
    } else {
        return <></>
    }
}