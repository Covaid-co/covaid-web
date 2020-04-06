import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'

import VolunteerDetails from './VolunteerDetails'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function VolunteerList(props) {

    const [volunteerDetailModal, setVolunteerDetailsModal] = useState(false);
    const [volunteers, setVolunteers] = useState([]);
    const [currVolunteer, setCurrVolunteer] = useState({});

    useEffect(() => {
        var url = "/api/users/allFromAssoc?";
        let params = {
            'association': props.association._id
        }
        let query = Object.keys(params)
             .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
             .join('&');
        url += query;

        fetch(url, {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
        }).then((response) => {
            if (response.ok) {
                response.json().then(data => {
                    setVolunteers(data);
                });
            } else {
                console.log(response);
            }
        }).catch((e) => {
            console.log(e);
        });
    }, [props.association])

    return (
        <>
            <Row>
                <Col xs={12}>
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
                        {volunteers.map((volunteer, i) => {
                            return (
                            <ListGroup.Item key={i} action onClick={() => {setCurrVolunteer({...volunteer}); setVolunteerDetailsModal(true)}}>
                                <div >
                                    <h5 className="volunteer-name">
                                        {volunteer.first_name} {volunteer.last_name}
                                    </h5>
                                </div>
                                <p style={{float: 'left', marginBottom: 0, marginTop: -2}}>
                                    {volunteer.offer.neighborhoods.join(', ')}
                                </p>
                            </ListGroup.Item>);
                        })}
                    </ListGroup>
                </Col>
            </Row>
            <VolunteerDetails volunteerDetailModal={volunteerDetailModal}
                              setVolunteerDetailsModal={setVolunteerDetailsModal}
                              currVolunteer={currVolunteer}/>
        </>
    )
}
