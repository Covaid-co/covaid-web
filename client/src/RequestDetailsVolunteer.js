import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal' 

export default function RequestDetailsVolunteer(props) {

    const options = ['Call ahead to store and pay (Best option)',
                     'Have volunteer pay and reimburse when delivered',
                     'N/A']

    return (
        <Modal show={props.modalOpen} onHide={() => props.setModalOpen(false)} style = {{marginTop: 40}}>
            <Modal.Header closeButton>
                <Modal.Title>{props.currRequest.requester_first} {props.currRequest.requester_last}'s Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 className="titleHeadings" style={{marginBottom: 3}}>Information</h5>
                <p id="request-info">Email: {props.currRequest.requester_email}</p>
                <p id="request-info">Phone: {props.currRequest.requester_phone}</p>
                <p id="request-info">Languages: {props.currRequest.languages ? props.currRequest.languages.join(', ') : ''}</p>
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Needs:</h5>
                <Badge className='task-info'>Medication</Badge>
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Details:</h5>
                <p id="request-info"> {props.currRequest.details}</p>
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Needed by:</h5>
                <p id="request-info">{props.currRequest.time} of {props.currRequest.date}</p>
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Payment:</h5>
                <p id="request-info">{options[props.currRequest.payment]}</p>
                {/* <Row style={{marginTop: 24}}>
                    <Col xs={6} style = {{padding: 0, paddingLeft: 15}}>
                        <Button id='leftCarButton'>
                            Accept
                        </Button>
                    </Col>
                    <Col xs={6} style = {{padding: 0, paddingRight: 15}}>
                        <Button id='rightCarButton'>
                            Decline
                        </Button>
                    </Col>
                </Row> */}
            </Modal.Body>
        </Modal>
    );
}