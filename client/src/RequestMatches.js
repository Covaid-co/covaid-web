import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default function RequestMatches(props) {

    const options = ['Call ahead to store and pay (Best option)',
                     'Have volunteer pay and reimburse when delivered',
                     'N/A']

    return (
        <Modal show={props.topMatchesModal} onHide={() => props.setTopMatchesModal(false)} style = {{marginTop: 40}}>
            <Modal.Header closeButton>
                <Modal.Title> {props.currRequest.requester_first}'s Top Matches</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 className="titleHeadings" style={{marginBottom: 3}}>Information</h5>
            </Modal.Body>
        </Modal>
    );
}