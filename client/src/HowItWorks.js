import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal'

export default function HowItWorks(props) {


    return (
        <>
        <Modal.Header closeButton>
                <Modal.Title>How It Works</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <h5>Questions?</h5>
                  <p style={{fontWeight: 300, fontStyle: 'italic'}}>Direct any questions or concerns to 
                  debanik1997@gmail.com or lijeffrey39@gmail.com</p>
            </Modal.Body>
        </>
    );
}
