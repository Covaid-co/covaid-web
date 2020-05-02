import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal' 
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VolunteerDetails from './VolunteerDetails';

export default function CreateRequestBeacon(props) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [volunteers, setVolunteers] = useState([]);
    const [currVolunteer, setCurrVolunteer] = useState({});
    const [volunteerDetailModal, setVolunteerDetailsModal] = useState(false);
    const [checkboxStatus, setCheckboxStatus] = useState({});

    useEffect(() => {
        setIsLoaded(true);
        setVolunteers(props.volunteers);
    }, [props.volunteers]);

    if (!isLoaded) {
        return <></>;
    }

    const handleCheckboxAction = (id) => {
        var temp_checkbox = JSON.parse(JSON.stringify(checkboxStatus));
        temp_checkbox[id] = !checkboxStatus[id];
        setCheckboxStatus(temp_checkbox);
    }

    return (
        <>
            <Modal size="lg" show={props.showCreateRequestBeaconModal} onHide={() => {props.setShowCreateRequestBeaconModal(false); props.setOriginalModal(true)}}>
                <Modal.Header closeButton>
                    <Modal.Title id="small-header">Create a Request Beacon</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup variant="flush" style={{overflowY: "scroll", height: 350}}>
                        {volunteers.map((volunteer, i) => {
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
                    <VolunteerDetails volunteerDetailModal={volunteerDetailModal}
                                    setVolunteerDetailsModal={setVolunteerDetailsModal}
                                    currVolunteer={currVolunteer}
                                    />
                </Modal.Body>
            </Modal>
        </>
    )
}