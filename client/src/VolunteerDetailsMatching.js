import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default function VolunteerDetailsMatching(props) {

    const matchVolunteer = () => {
        const requester_id = props.currRequest._id;
        const volunteer_id = props.currVolunteer._id;
        const volunteer_email = props.currVolunteer.email
        const assoc_id = props.currRequest.association

        let form = {
            'request_id': requester_id,
            'volunteer_id': volunteer_id,
            'volunteer_email': volunteer_email,
            'association': assoc_id
        };

        fetch('/api/request/attachVolunteerToRequest', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                console.log("attached");
                props.setVolunteerDetailsModal(false);
                props.setTopMatchesModal(false);
                props.setRequestDetailsModal(false);
                window.location.reload();
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            alert('could not attach');
        });
    }

    return (
        <Modal id="volunteer-details-matching" show={props.volunteerDetailModal} onHide={() => props.setVolunteerDetailsModal(false)} style = {{marginTop: 80}}>
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
                <p id="request-info">Languages: {props.currVolunteer.languages.join(', ')}</p>
                <p id="request-info">Has car: 
                    {props.currVolunteer.offer ? (props.currVolunteer.offer.car ? ' Yes': ' No') : ""}
                </p>
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Tasks:</h5>
                {props.currVolunteer.offer ? props.currVolunteer.offer.tasks.map((task, i) => {
                    return <Badge key={i} className='task-info'>{task}</Badge>
                }) : ""}
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Details:</h5>
                <p id="request-info"> {props.currVolunteer.offer ? props.currVolunteer.offer.details : ""}</p>
                <Button id="nextPage" onClick={matchVolunteer}>Match with {props.currVolunteer.first_name}</Button>
            </Modal.Body>
        </Modal>
    );

}