import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default function RequestDetails(props) {

    return (
        <Modal show={props.modalOpen} onHide={() => props.setModalOpen(false)} style = {{marginTop: 40}}>
            <Modal.Header closeButton>
                <Modal.Title>Bob's Offer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 className="titleHeadings" style={{marginBottom: 3}}>Information</h5>
                <p id="request-info">Email: </p>
                <p id="request-info">Phone: </p>
                <p id="request-info">Languages: </p>
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Needs:</h5>
                <Badge className='task-info'>Medication</Badge>
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Details:</h5>
                <p id="request-info">I need help getting grociers from trader Joes. It would mean a lot of someone could help me do that</p>
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Needed by:</h5>
                <p id="request-info">Evening of Jan 2, 2020</p>
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Payment:</h5>
                <p id="request-info">Pay after</p>
                <Row style={{marginTop: 24}}>
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
                </Row>
            </Modal.Body>
        </Modal>
    );
}