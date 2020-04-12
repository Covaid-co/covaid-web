import React, {useState, useEffect} from 'react';
import { useFormFields } from "./libs/hooksLib";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'

export default function OrgResourcesModal(props) {

    const [fields, handleFieldChange] = useFormFields({
        resourceName: "",
        resourceLink: ""
    });

    return (
        <Modal show={props.resourceModal} onHide={() => props.setResourceModal(false)} style = {{marginTop: 10, paddingBottom: 40}}>
            <Modal.Header closeButton>
                <Modal.Title>Add a resource</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col xs={12}>
                        <Form>
                            <Form.Group controlId="resourceName" bssize="large" style={{marginTop: 0}}>
                                <Form.Control placeholder="Name of Resource" onChange={handleFieldChange}/>
                            </Form.Group>
                            <Form.Group controlId="resourceLink" bssize="large" style={{marginTop: 5}}>
                                <Form.Control placeholder="Resource Link" onChange={handleFieldChange}/>
                            </Form.Group>
                            <Button style={{marginTop: 5}} id="createAccount">Submit Resource</Button>
                        </Form>
                    </Col>
                    <Col xs={12}>
                        <Modal.Title style={{fontSize: 22, marginTop: 20}}>Current Resources</Modal.Title>
                        <p id="requestCall" style={{marginTop: -15, marginBottom: 0}}>&nbsp;</p>
                    </Col>
                    <Col xs={12}>
                        
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
}