import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default function RequestDetails(props) {

    const options = ['Call ahead to store and pay (Best option)',
                     'Have volunteer pay and reimburse when delivered',
                     'N/A']

    const topMatch = () => {
        props.setRequestDetailsModal(false);
        props.setTopMatchesModal(true);
    }

    return (
        <Modal show={props.requestDetailsModal} onHide={() => props.setRequestDetailsModal(false)} style = {{marginTop: 40}}>
            <Modal.Header closeButton>
                <Modal.Title>Request Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 className="titleHeadings" style={{marginBottom: 3}}>Information</h5>
                <p id="request-info">Name: {props.currRequest.requester_first} {props.currRequest.requester_last}</p>
                <p id="request-info">Email: {props.currRequest.requester_email}</p>
                <p id="request-info">Phone: {props.currRequest.requester_phone}</p>
                <p id="request-info">Needed by: {props.currRequest.time} of {props.currRequest.date}</p>
                <p id="request-info">Payment: {options[props.currRequest.payment]}</p>
                <p id="request-info">Languages: {props.currRequest.languages ? props.currRequest.languages.join(', ') : ''}</p>
                <p id="request-info">Needs: {props.currRequest.resource_request ? props.currRequest.resource_request.join(', ') : ''}</p>
                {/* <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Needs:</h5> */}
                {/* <Badge className='task-info'>Medication</Badge> */}
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Details:</h5>
                <p id="request-info"> {props.currRequest.details}</p>
                {/* <p id="requestCall" style={{marginTop: 15, marginBottom: 15}}></p> */}
                <Button id="nextPage" onClick={topMatch}>Find a volunteer for {props.currRequest.requester_first}!</Button>
            </Modal.Body>
        </Modal>
    );
}