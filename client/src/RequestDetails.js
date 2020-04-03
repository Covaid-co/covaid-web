import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button'
import RequestMatches from './RequestMatches'
import Modal from 'react-bootstrap/Modal'

export default function RequestDetails(props) {

    const [topMatchesModal, setTopMatchesModal] = useState(false);
    const options = ['Call ahead to store and pay (Best option)',
                     'Have volunteer pay and reimburse when delivered',
                     'N/A']

    const topMatch = () => {
        props.setRequestDetailsModal(false);
        setTopMatchesModal(true);
    }

    const unMatch = () => {
        const requester_id = props.currRequest._id;
        const volunteer_id = props.currRequest.status.volunteer;

        let form = {
            'request_id': requester_id,
            'volunteer_id': volunteer_id
        };

        fetch('/api/request/removeVolunteerFromRequest', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                console.log("attached");
                setTopMatchesModal(false);
                props.setRequestDetailsModal(false);
                window.location.reload();
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const completeRequest = () => {
        const requester_id = props.currRequest._id;
        const volunteer_id = props.currRequest.status.volunteer;

        let form = {
            'request_id': requester_id,
            'volunteer_id': volunteer_id
        };

        fetch('/api/request/completeRequest', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                console.log("attached");
                setTopMatchesModal(false);
                props.setRequestDetailsModal(false);
                window.location.reload();
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const modeButton = () => {
        if (props.mode === 1) {
            return <Button id="nextPage" onClick={topMatch}>Find a volunteer for {props.currRequest.requester_first}!</Button>;
        } else if (props.mode === 2) {
            return (<>
                    <Button id="nextPage"
                            onClick={unMatch}
                            style={{backgroundColor: '#dc3545', borderColor: '#dc3545'}}>
                        Unmatch {props.currRequest.requester_first}'s Volunteer
                    </Button>
                    <Button id="nextPage" 
                            style={{backgroundColor: '#28a745', borderColor: '#28a745', marginTop: 8}} 
                            onClick={completeRequest}>
                        Complete {props.currRequest.requester_first}'s Request
                    </Button>
                </>);
        } else {
            return (<Button id="nextPage"
                        onClick={unMatch}
                        style={{backgroundColor: '#dc3545', borderColor: '#dc3545'}}>
                        Unmatch {props.currRequest.requester_first}'s Volunteer
                    </Button>);
        }
    }

    return (
        <>
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
                    {modeButton()}
                </Modal.Body>
            </Modal>

            <RequestMatches topMatchesModal={topMatchesModal} 
                            setTopMatchesModal={setTopMatchesModal} 
                            currRequest={props.currRequest}
                            association={props.association}
                            setRequestDetailsModal={props.setRequestDetailsModal}/>
        </>
    );
}