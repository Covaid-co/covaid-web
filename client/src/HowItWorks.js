import React from "react";
import Modal from 'react-bootstrap/Modal'

export default function HowItWorks(props) {


    return (
        <>
        <Modal.Header closeButton>
            <Modal.Title>How It Works</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <h5>Community Bulletin</h5>
            <p>The community bulletin is home to all offers of mutual aid being made by your community. Each entry represents an offer by a particular user, and displays information regarding what tasks this user can support. More information about each offer, such as contact information, can be found by clicking the offer.</p>
            <h5>Questions?</h5>
            <p style={{fontWeight: 300, fontStyle: 'italic'}}>Direct any questions or concerns to 
            debanik1997@gmail.com or lijeffrey39@gmail.com</p>
        </Modal.Body>
        </>
    );
}
