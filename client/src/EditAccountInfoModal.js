import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function EditAccountInfoModal(props) {

    return (
        <>
         <Modal.Header closeButton>
                <Modal.Title>Update your account information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container id="volunteer-info" style={{maxWidth: 2000, marginLeft: 0, marginRight: 0, color: 'black'}}>
                <Row>
                <Col>
                {/* <h3 className="volunteerName" style={{marginTop: 0, marginBottom: 10, fontSize: 20}}>Your Profile</h3>
                <p id="requestCall" style={{marginTop: 0, marginBottom: 20}}></p>
                <div style={{marginTop: 0, marginBottom: 20}}>
                    <h5 className="volunteerName" style={{marginTop: 0, marginBottom: 10, fontWeight: "normal"}}><b>Name:</b> {user.first_name + " " + user.last_name}</h5>
                    {phoneNum}
                    <h5 className="volunteerName" style={{marginTop: 0, marginBottom: 10, fontWeight: "normal"}}><b>Email:</b> {user.email}</h5>
                </div>
                <div style={{marginTop: 0, marginBottom: 20}}>
                    {assocName}
                    <h5 className="volunteerName" style={{marginTop: 0, marginBottom: 10, fontWeight: "normal"}}><b>Location:</b> {user.offer.neighborhoods.join(", ")}</h5>
                </div>
                <div style={{marginTop: 0, marginBottom: 20}}>
                    <h5 className="volunteerName" style={{marginTop: 0, marginBottom: 10, fontWeight: "normal"}}><b>Languages:</b> {user.languages.join(", ")}</h5>
                    <h5 className="volunteerName" style={{marginTop: 0, marginBottom: 10, fontWeight: "normal"}}><b>Car:</b> {user.offer.car ? "Yes" : "No"}</h5>
                    <h5 className="volunteerName" style={{marginTop: 0, marginBottom: 10, fontWeight: "normal"}}><b>Availability:</b> {user.offer.timesAvailable.join(", ")}</h5>
                </div>
                <p id="requestCall" style={{marginTop: 0, marginBottom: 10}}></p>
                <Button onClick={() => {setShowEditModal(true);}} style={{margin: "auto", display: "block"}}variant="link">Edit Info</Button> */}
                </Col>
                </Row>
                </Container>
            </Modal.Body>
        </>
    );
}