import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default function OfferDetails(props) {
    return (
        <Modal show={props.modalOfferOpen} onHide={() => props.setModalOfferOpen(false)} style = {{marginTop: 20}}>
            <Modal.Header closeButton>
                <Modal.Title id="small-header">{props.modalInfo.first_name}'s Offer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 id="regular-text-bold" style={{marginBottom: 0}}>Neighborhoods:</h5>
                <p id="regular-text">{props.modalInfo.offer.neighborhoods.join(', ')}</p>
                <h5 id="regular-text-bold" style={{marginBottom: 5, marginTop: 16}}>Tasks:</h5>
                {props.modalInfo.offer.tasks.map((task, i) => {
                    return <Badge key={i} id='task-info'>{task}</Badge>
                })}
                <h5 id="regular-text-bold" style={{marginBottom: 0, marginTop: 16}}>Details:</h5>
                <p id="regular-text">{props.modalInfo.offer.details}</p>
                <Button id="large-button" style={{marginTop: 15}} onClick={() => {props.setModalOfferOpen(false); props.handleShowRequestHelp();}}>
                    Request Help!
                </Button>
            </Modal.Body>
            <Modal.Footer>
                <p id="regular-text" style={{fontStyle: "italic", fontSize: 14}}>
                    Be sure to coordinate a safe drop-off/interaction! Follow <a target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/prepare/prevention.html"> CDC guidelines </a> 
                    on cleanliness and avoid as much contact as possible to prevent further spread of virus.
                </p>
            </Modal.Footer>
        </Modal>
    );
}