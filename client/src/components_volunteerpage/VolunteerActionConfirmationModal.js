import React from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal' 
import 'bootstrap/dist/css/bootstrap.min.css';

export default function VolunteerActionConfirmationModal(props) {

    const complete = () => {
        const requester_id = props.currRequest._id;
        const volunteer_id = props.currRequest.status.volunteer;
        const assoc_id = props.currRequest.association

        let form = {
            'request_id': requester_id,
            'volunteer_id': volunteer_id,
            'reason': 'Volunteer Completed',
            'assoc_id': assoc_id
        };

        fetch('/api/request/completeRequest', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                props.setShowConfirmationModal(false); 
                props.setOriginalModal(false)
                props.complete();
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const reject = () => {
        const requester_id = props.currRequest._id;
        const volunteer_id = props.currRequest.status.volunteer;

        let form = {
            'request_id': requester_id,
            'volunteer_id': volunteer_id,
            'assoc_id': props.currRequest.association
        };

        fetch('/api/request/removeVolunteerFromRequest', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                props.setShowConfirmationModal(false); 
                props.setOriginalModal(false)
                props.reject();
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const action = props.action === 'complete' ? complete : reject;

    return (
        <>
            <Modal size="sm" show={props.showModal} onHide={() => {props.setShowConfirmationModal(false); props.setOriginalModal(true)}}>
                <Modal.Header closeButton>
                    <Modal.Title id="small-header">{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id="regular-text">{props.confirmation}</p>
                    <Button id="large-button" style={{backgroundColor: props.buttonColor, border: '1px solid ' + props.buttonColor}} onClick={action}>
                        Confirm
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    )
}