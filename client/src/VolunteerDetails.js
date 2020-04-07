import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Badge from 'react-bootstrap/Badge'
import Modal from 'react-bootstrap/Modal'

export default function VolunteerDetails(props) {

    const [mapURL, setMapURL] = useState('');

    useEffect(() => {
        var tempURL = "https://www.google.com/maps/@";
        if (props.currVolunteer.latlong) {
            tempURL += props.currVolunteer.latlong[1] + ',';
            tempURL += props.currVolunteer.latlong[0] + ',15z';
        }
        setMapURL(tempURL);
    }, [props.currVolunteer])

    if ((props.currRequest && props.currRequest.status.volunteer === "") || props.currRequest && props.currRequest.status.volunteer === null) {
        return (
            <Modal  id="volunteer-details-matching" show={props.volunteerDetailModal} onHide={() => props.setVolunteerDetailsModal(false)} style = {{marginTop: 40}}>
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
    }
    return (
        <Modal  id="volunteer-details-matching" show={props.volunteerDetailModal} onHide={() => props.setVolunteerDetailsModal(false)} style = {{marginTop: 40}}>
            <Modal.Header closeButton>
                <Modal.Title>{props.currVolunteer.first_name} {props.currVolunteer.last_name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 className="titleHeadings" style={{marginBottom: 3}}>Information</h5>
                {/* <p id="request-info">Name: {props.currVolunteer.requester_first} {props.currVolunteer.requester_last}</p> */}
                <p id="request-info">Availabile to help: {props.currVolunteer.availability ? ' Yes':' No'}</p>
                <p id="request-info">Email: {props.currVolunteer.email}</p>
                <p id="request-info">Phone: {props.currVolunteer.phone}</p>
                <p id="request-info">Neighborhoods: {props.currVolunteer.offer ? props.currVolunteer.offer.neighborhoods.join(', ') : ""}
                </p>
                <p id="request-info">Languages: {props.currVolunteer.languages ? props.currVolunteer.languages.join(', ') : ""}
                </p>
                <p id="request-info">Has car: 
                    {props.currVolunteer.offer ? (props.currVolunteer.offer.car ? ' Yes': ' No') : ""}
                </p>
                <p id="request-info">Location: <a target="_blank" href={mapURL}>Click here</a></p>
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Tasks:</h5>
                {props.currVolunteer.offer ? props.currVolunteer.offer.tasks.map((task, i) => {
                    return <Badge key={i} className='task-info'>{task}</Badge>
                }) : ""}
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Details:</h5>
                <p id="request-info"> {props.currVolunteer.offer ? props.currVolunteer.offer.details : ""}</p>
            </Modal.Body>
        </Modal>
    );
}