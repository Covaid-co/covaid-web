import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import VolunteerDetailsMatching from './VolunteerDetailsMatching'
import ManualVolunteerMatching from './ManualVolunteerMatching'

import 'bootstrap/dist/css/bootstrap.min.css';

export default function BestMatches(props) {

    const [volunteerDetailModal, setVolunteerDetailsModal] = useState(false);
    const [manualModal, setManualModal] = useState(false);
    const [volunteers, setVolunteers] = useState([]);
    const [currVolunteer, setCurrVolunteer] = useState({});

    useEffect(() => {
        var url = "/api/users/allFromAssoc?";
        let params = {
            'association': props.association._id,
            'latitude': props.currRequest.latitude,
            'longitude': props.currRequest.longitude
        }
        let query = Object.keys(params)
             .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
             .join('&');
        url += query;
        // console.log(url)

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
    }, [props.association]);

    var rad = function(x) {
        return x * Math.PI / 180;
    };

    function calcDistance(latA, longA, latB, longB) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(latB - latA);
        var dLong = rad(longB - longA);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(latA)) * Math.cos(rad(latB)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
    }

    const distance = (volunteer) => {
        const latA = volunteer.latlong[1];
        const longA = volunteer.latlong[0];
        const latB = props.currRequest.latitude;
        const longB = props.currRequest.longitude;
        const meters = calcDistance(latA, longA, latB, longB);
        const miles = meters * 0.00062137;
        return Math.round(miles * 100) / 100;
    }
    
    return (
        <>
            <Row style={{marginTop: -9}}>

                <Col xs={12}>
                    <Button id="nextPage" onClick={()=>{setManualModal(true)}} style={{marginTop: 0}}>Manually Enter Volunteer</Button>;
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
                                     currRequest={props.currRequest}/>
            <VolunteerDetailsMatching volunteerDetailModal={volunteerDetailModal}
                                      setVolunteerDetailsModal={setVolunteerDetailsModal}
                                      currVolunteer={currVolunteer}
                                      currRequest={props.currRequest}
                                      setTopMatchesModal={props.setTopMatchesModal}
                                      setRequestDetailsModal={props.setRequestDetailsModal}/>
        </>
    )
}
