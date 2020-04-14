import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import ManualVolunteerMatching from './ManualVolunteerMatching'
import VolunteerDetails from './VolunteerDetails'
import { calcDistance } from './Helpers';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function BestMatches(props) {

    const [volunteerDetailModal, setVolunteerDetailsModal] = useState(false);
    const [manualModal, setManualModal] = useState(false);
    const [sortedVolunteers, setSortedVolunteers] = useState([]);
    const [currVolunteer, setCurrVolunteer] = useState({});

    useEffect(() => {
        props.volunteers.sort(function(a, b) {
            return distance(a) - distance(b)
        });
        setSortedVolunteers(props.volunteers);
    }, [props.currRequest]);

    const distance = (volunteer) => {
        const latA = volunteer.latitude;
        const longA = volunteer.longitude;
        const latB = props.currRequest.latitude;
        const longB = props.currRequest.longitude;
        const meters = calcDistance(latA, longA, latB, longB);
        const miles = meters * 0.00062137;
        return Math.round(miles * 100) / 100;
    }
    
    return (
        <Modal show={props.topMatchesModal} onHide={() => props.setTopMatchesModal(false)} style = {{marginTop: 30, paddingBottom: 40}}>
            <Modal.Header closeButton>
                <Modal.Title> {props.currRequest.requester_first}'s Top Matches</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row style={{marginTop: -9}}>
                    <Col xs={12}>
                        <Button id="nextPage" onClick={()=>{setManualModal(true)}} style={{marginTop: 0}}>Manually Enter Volunteer</Button>
                        <Form>
                            <Form.Group controlId="zip" bssize="large" style={{marginTop: 10}}>
                                <Form.Control placeholder="Search for a volunteer"/>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col xs={12}>
                        <p id="requestCall" style={{marginTop: 10, marginBottom: 0}}></p>
                    </Col>
                    <Col xs={12}>
                        <ListGroup variant="flush" onClick={() => {setVolunteerDetailsModal(true)}}>
                            {sortedVolunteers.map((volunteer, i) => {
                                return (
                                <ListGroup.Item key={i} action onClick={() => {setCurrVolunteer({...volunteer}); setVolunteerDetailsModal(true)}}>
                                    <div >
                                        <h5 className="volunteer-name">
                                            {volunteer.first_name} {volunteer.last_name}
                                        </h5>
                                    </div>
                                    <div>
                                        <p style={{float: 'left', marginBottom: 0, marginTop: -2}}>
                                            {volunteer.offer.neighborhoods.join(', ')}
                                        </p>
                                        <p style={{float: 'right', marginBottom: 0, marginTop: -14, marginRight: 10}}>
                                            {distance(volunteer)} miles
                                        </p>
                                    </div>
                                </ListGroup.Item>);
                            })}
                        </ListGroup>
                    </Col>
                </Row>
                <ManualVolunteerMatching manualModal={manualModal}
                                        setManualModal={setManualModal}
                                        setCurrRequest={props.setCurrRequest}
                                        setRequestDetailsModal={props.setRequestDetailsModal}
                                        setTopMatchesModal={props.setTopMatchesModal}
                                        unmatched={props.unmatched}
                                        matched={props.matched}
                                        setUnmatched={props.setUnmatched}
                                        setMatched={props.setMatched}
                                        currRequest={props.currRequest}/>
                <VolunteerDetails volunteerDetailModal={volunteerDetailModal}
                                    setVolunteerDetailsModal={setVolunteerDetailsModal}
                                    currVolunteer={currVolunteer}
                                    currRequest={props.currRequest}
                                    setCurrRequest={props.setCurrRequest}
                                    setTopMatchesModal={props.setTopMatchesModal}
                                    setRequestDetailsModal={props.setRequestDetailsModal}
                                    unmatched={props.unmatched}
                                    matched={props.matched}
                                    setUnmatched={props.setUnmatched}
                                    setMatched={props.setMatched}
                                    matching={true}/>
            </Modal.Body>
        </Modal>
    )
}
