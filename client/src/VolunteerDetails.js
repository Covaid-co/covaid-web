import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default function VolunteerDetails(props) {

    return (
        <Modal show={props.modalOpen} onHide={() => props.setModalOpen(false)} style = {{marginTop: 40}}>
            <Modal.Header closeButton>
                <Modal.Title>Bob's Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 className="titleHeadings" style={{marginBottom: 3}}>Information</h5>
                <p id="request-info">Email: </p>
                <p id="request-info">Phone: </p>
                <p id="request-info">Languages: </p>
                <p id="request-info">Can Drive: </p>
                <p id="request-info">City: </p>
                <p id="request-info">Availability: </p>
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Tasks:</h5>
                <Badge className='task-info'>Medication</Badge>
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Details:</h5>
                <p id="request-info">I need help getting grociers from trader Joes. It would mean a lot of someone could help me do that</p>
            </Modal.Body>
        </Modal>
    );
}