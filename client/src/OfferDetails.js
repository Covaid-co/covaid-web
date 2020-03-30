import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default function OfferDetails(props) {

    return (
        <Modal show={props.modalOfferOpen} onHide={() => props.setModalOfferOpen(false)} style = {{marginTop: 80}}>
            <Modal.Header closeButton>
                <Modal.Title>{props.modalInfo.first_name}'s Offer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 className="titleHeadings" style={{marginBottom: 0}}>Neighborhoods:</h5>
                <p id="locationInfo">
                    {props.modalInfo.offer.neighborhoods.join(', ')}
                </p>
                <h5 className="titleHeadings" style={{marginBottom: 0, marginTop: 16}}>Tasks:</h5>
                {props.modalInfo.offer.tasks.map((task, i) => {
                    return <Badge key={i} id="selected" style = {{whiteSpace: "normal"}}>{task}</Badge>
                })}
                <h5 className="titleHeadings" style={{marginBottom: 0, marginTop: 16}}>Details:</h5>
                <p id="locationInfo">{props.modalInfo.offer.details}</p>
                <Button id="nextPage" onClick={() => {props.setModalOfferOpen(false); props.handleShowRequestHelp();}}>Request Help!</Button>
            </Modal.Body>
            <Modal.Footer>
                <p style={{fontStyle: "italic"}}>
                    Be sure to coordinate a safe drop-off/interaction! Follow 
                    <a target="_blank" 
                        rel="noopener noreferrer" 
                        href="https://www.cdc.gov/coronavirus/2019-ncov/prepare/prevention.html"> CDC guidelines</a> on 
                        cleanliness and avoid as much contact as possible to prevent further spread of virus.
                </p>
            </Modal.Footer>
        </Modal>
    );
}