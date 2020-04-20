import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'
import { useFormFields } from "../libs/hooksLib";

import { extractTrueObj, setFalseObj } from '../Helpers';
import { defaultResources } from '../constants';
import CheckForm from '../CheckForm'
import NewHasCar from '../components_homepage/NewHasCar'

export default function BeaconCreation(props) {

    const [taskChecked, setTaskChecked] = useState({});
    const [hasCar, setHasCar] = useState(false);
    const [page, setPage] = useState(1);
    const [foundVolunteers, setFoundVolunteers] = useState([]);
    const [checkboxChecked, setCheckboxChecked] = useState({});

    useEffect(() => {
        if (props.association.resources) {
            var tempResources = setFalseObj(props.association.resources);
            setTaskChecked(tempResources);
        } else {
            setTaskChecked(setFalseObj(defaultResources));
        }
    }, [props.association, props.voluneers]);

    const findVolunteers = () => {
        var tasks = [];
        for (var key in taskChecked) {
            if (taskChecked.hasOwnProperty(key)) {
                if (taskChecked[key]) {
                    tasks.push(key);
                }
            }
        }

        var filteredVolunteers = [];
        var needed_resources = tasks;
        var foundChecked = {};
        props.volunteers.forEach(
            function(volunteer) { 
                var volunteer_resources = volunteer.offer.tasks;
                if (volunteer_resources.some(item => needed_resources.includes(item))) {
                    if (!hasCar || volunteer.offer.car) {
                        filteredVolunteers.push(volunteer)
                        foundChecked[volunteer._id] = false;
                    }
                } 
            }
        );

        setFoundVolunteers(filteredVolunteers);
        setCheckboxChecked(foundChecked);

        setPage(2);
    }

    const handleCheck = (id) => {
        const tempBox = JSON.parse(JSON.stringify(checkboxChecked));
        tempBox[id] = !checkboxChecked[id];
        setCheckboxChecked(tempBox)
    }

    const sendBeacon = () => {
        console.log(checkboxChecked)
    }

    if (page === 1) {
        return(
            <>
                <Modal size="lg" show={props.beaconModal} onHide={() => {setPage(1); props.setBeaconModal(false)}} style = {{marginTop: 10, paddingBottom: 40}}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{marginLeft: 5}}>Create a beacon</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{paddingTop: 0}}>
                        <div id='page1'>
                            <Col xs="12">
                                <p id="regular-text" style={{marginTop: 10, marginBottom: 10}}>Beacons are a way for you to reach out to your volunteers in mass.
                                Use the filters below and we'll curate the most optimal volunteers to get this done</p>
                                <h5 id="regular-text-bold" style = {{marginTop: 10, marginBottom: 5}}>
                                    What resources do you need from your volunteers?
                                </h5>
                                <CheckForm obj={taskChecked} setObj={setTaskChecked}/>
                                <h5 id="regular-text-bold" style = {{marginTop: 20, marginBottom: 5}}>
                                    Will they need a car?
                                </h5>
                                <NewHasCar hasCar={hasCar} setHasCar={setHasCar}/>
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
    } else if (page === 2) {
        return (
            <>
                <Modal size="md" show={props.beaconModal} onHide={() => {setPage(1); props.setBeaconModal(false)}} style = {{marginTop: 10, paddingBottom: 40}}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{marginLeft: 5}}>Create a beacon</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{paddingTop: 0}}>
                        <div id='page2'>
                            <Row>
                                <Col xs="12">
                                    <h5 id="regular-text-bold" style = {{marginTop: 10, marginBottom: 5}}>
                                        Found {foundVolunteers.length} volunteers
                                    </h5>
                                    <ListGroup variant="flush" style={{overflowY: "scroll", height: 250}}>
                                        {foundVolunteers.map((volunteer, i) => {
                                            return (
                                            <ListGroup.Item key={i}>
                                                <Row>
                                                    <Col lg={1}>
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={checkboxChecked[volunteer._id]}
                                                            onChange={() => handleCheck(volunteer._id)}
                                                            id='default-checkbox'
                                                        />
                                                    </Col>
                                                    <Col lg={11}>
                                                        <h5 id="volunteer-name">
                                                            {volunteer.first_name} {volunteer.last_name}
                                                        </h5>
                                                        <p id="volunteer-location">{volunteer.offer.neighborhoods.join(', ')}</p>
                                                        {volunteer.offer.tasks.length === 0 ? 
                                                            <Badge className='task-info' style={{background: '#AE2F2F', border: '1px solid #AE2F2F'}}>
                                                                No tasks entered
                                                            </Badge> 
                                                            : volunteer.offer.tasks.map((task, i) => {
                                                                    return <Badge key={i} id='task-info'>{task}</Badge>;
                                                            }
                                                        )}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>);
                                        })}
                                    </ListGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form>
                                        <Form.Group controlId="beaconDetails" bssize="large" style={{marginTop: 10}}>
                                            <Form.Control as="textarea" 
                                                        rows="3"
                                                        placeholder="Beacon message"
                                                    />
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                            <Button style={{marginTop: 20}}
                                    id="large-button"
                                    onClick={sendBeacon}
                                    >
                                        Send out beacon</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        );
    } else {
        return <></>
    }
}