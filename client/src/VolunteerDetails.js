import React, { useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { generateMapsURL, moveFromToArr } from './Helpers';

export default function VolunteerDetails(props) {

    const [mapURL, setMapURL] = useState('');
    const [verified, setVerified] = useState(true);

    useEffect(() => {
        if (props.currVolunteer.latlong) {
            const tempURL = generateMapsURL(props.currVolunteer.latlong[1], props.currVolunteer.latlong[0]);
            setMapURL(tempURL);
            setVerified(props.currVolunteer.preVerified);
        }
    }, [props.currVolunteer])

    const handleChangeVerify = (event) => {
        event.persist();
        setVerified(!verified);
    };

    const matchVolunteer = () => {
        const requester_id = props.currRequest._id;
        const volunteer_id = props.currVolunteer._id;
        const volunteer_email = props.currVolunteer.email;
        const assoc_id = props.currRequest.association;
        const volunteer_name = props.currVolunteer.first_name
        var first_name = volunteer_name;
        first_name = first_name.toLowerCase();
        first_name = first_name[0].toUpperCase() + first_name.slice(1);

        let form = {
            'request_id': requester_id,
            'volunteer_id': volunteer_id,
            'volunteer_email': volunteer_email,
            'volunteer_name': first_name,
            'association': assoc_id
        };

        fetch('/api/request/attachVolunteerToRequest', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                const newRequest = {
                    ...props.currRequest,
                    'status': {
                        'current_status': 'in_progress',
                        'volunteer': volunteer_id
                    }
                }
                props.setCurrRequest(newRequest);
                moveFromToArr(newRequest, props.unmatched, props.setUnmatched, props.matched, props.setMatched);
                props.setVolunteerDetailsModal(false);
                props.setTopMatchesModal(false);
                props.setRequestDetailsModal(false);
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            alert('could not attach');
        });
    }

    const displaySwitch = () => {
        return (<Form style = {{position: "absolute", marginLeft: 10, top: 11, display: 'inline-block'}}>
                    <Form.Group controlId="preverify" bssize="large" style = {{marginBottom: 0, marginTop: 2}}>
                        <Form.Check 
                            type="switch"
                            id="custom-switch"
                            style={{color: '#7F7F7F', fontSize: 14}}
                            label={verified ? "Verified": "Not Verified"}
                            checked={verified}
                            onChange={handleChangeVerify}/>
                    </Form.Group>
                </Form>);
    }

    if (Object.keys(props.currVolunteer).length > 0) {
        return (
            <Modal id="volunteer-details-matching" show={props.volunteerDetailModal} onHide={() => {
                    props.setVolunteerDetailsModal(false);
                    if (props.setVolunteersModal) {
                        props.setVolunteersModal(true);
                    }
                }} style = {{marginTop: 40}}>
                <Modal.Header closeButton>
                    <Modal.Title>Volunteer Information</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding: 24, paddingTop: 10}}>
                    <div id="name-details">{props.currVolunteer.first_name} {props.currVolunteer.last_name} 
                        {props.currVolunteer.availability ? 
                            <Badge aria-describedby='tooltip-bottom' variant="success" id='volunteerBadge' style={{marginLeft: 8, marginTop: -4}}>Available</Badge>
                          : <Badge aria-describedby='tooltip-bottom' variant="success" id='volunteerBadge' style={{marginLeft: 8, marginTop: -4, backgroundColor: '#dc3545'}}>Not Available</Badge>}
                        {displaySwitch()}
                    </div>
                    <p id="request-info" style={{marginTop: 5}}>Location: <a target="_blank" rel="noopener noreferrer" href={mapURL}>Click here</a></p>
                    <p id="request-info">{props.currVolunteer.email}</p>
                    <p id="request-info">{props.currVolunteer.phone}</p>
                    <p id="request-info" style={{marginTop: 14}}>Languages: {props.currVolunteer.languages ? props.currVolunteer.languages.join(', ') : ""}</p>
                    <p id="request-info">Neighborhoods: {props.currVolunteer.offer ? props.currVolunteer.offer.neighborhoods.join(', ') : ""}</p>
                    <p id="request-info">Driver: {props.currVolunteer.offer ? (props.currVolunteer.offer.car ? ' Yes': ' No') : ""}</p>
                    <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Tasks:</h5>
                    {props.currVolunteer.offer ? props.currVolunteer.offer.tasks.map((task, i) => {
                        return <Badge key={i} className='task-info'>{task}</Badge>
                    }) : ""}
                    <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Details:</h5>
                    <p id="request-info"> {props.currVolunteer.offer ? props.currVolunteer.offer.details : ""}</p>
                    {props.matching ? <Button id="nextPage" onClick={matchVolunteer}>Match with {props.currVolunteer.first_name}</Button> : <></>}
                </Modal.Body>
            </Modal>
        );
    } else if (props.currRequest && props.currRequest.status === undefined) {
        return (
            <Modal id="volunteer-details-matching" show={props.volunteerDetailModal} onHide={() => {
                    props.setVolunteerDetailsModal(false);
                    if (props.setVolunteersModal) {
                        props.setVolunteersModal(true);
                    }
                }} style = {{marginTop: 40}}>
                <Modal.Header closeButton>
                    <Modal.Title>Volunteer Information</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding: 24, paddingTop: 10}}>
                    Loading...
                </Modal.Body>
            </Modal>
        );
    } else if (props.currRequest && props.currRequest.status.volunteer === "manual") {
        return (
            <Modal id="volunteer-details-matching" show={props.volunteerDetailModal} onHide={() => props.setVolunteerDetailsModal(false)} style = {{marginTop: 40}}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.currRequest.manual_match.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className="titleHeadings" style={{marginBottom: 3}}>Information</h5>
                    <p id="request-info">Email: {props.currRequest.manual_match.email}</p>
                    <p id="request-info">Phone: {props.currRequest.manual_match.phone}</p>
                    <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Details:</h5>
                    <p id="request-info"> {props.currRequest.manual_match.details}</p>
                </Modal.Body>
            </Modal>
        )
    } else {
        return (
            <Modal id="volunteer-details-matching" show={props.volunteerDetailModal} onHide={() => {
                    props.setVolunteerDetailsModal(false);
                    if (props.setVolunteersModal) {
                        props.setVolunteersModal(true);
                    }
                }} style = {{marginTop: 40}}>
                <Modal.Header closeButton>
                    <Modal.Title>Volunteer Information</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding: 24, paddingTop: 10}}>
                    Loading...
                </Modal.Body>
            </Modal>
        );
    }
}