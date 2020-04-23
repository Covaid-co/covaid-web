import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Modal from 'react-bootstrap/Modal' 
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AcceptedVolunteersModal(props) {

    return (
        <>
            <Modal size="md" show={props.showAcceptedVolunteers} onHide={() => {props.setShowAcceptedVolunteers(false); props.setOriginalModal(true)}}>
                <Modal.Header closeButton>
                    <Modal.Title id="small-header">Beacon-accepting Volunteers</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup variant="flush" style={{overflowY: "scroll", height: 200}}>
                        {!props.acceptedVolunteers ? <></> :
                        props.acceptedVolunteers.map((volunteer, i) => {
                            return (
                                <ListGroup.Item key={i}>
                                    <div >
                                        <h5 id="volunteer-name">
                                            {volunteer.volunteer_first} {volunteer.volunteer_last} 
                                        </h5>
                                        {/* <Badge style={{float: "right", marginTop: 2}} key={i} className='pending-task'>Not Accepted</Badge> */}
                                    </div>
                                </ListGroup.Item>);
                            })}
                        </ListGroup>
                </Modal.Body>
            </Modal>
        </>
    )
}