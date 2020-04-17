import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Toast from 'react-bootstrap/Toast'

export default function NewLocationSetting(props) {

    const [locationString, setLocationString] = useState('');
    const [showInvalid, setShowInvalid] = useState(false);

    const handleSubmit = (e) => {
        props.locationSubmit(e, locationString).then((res) => {
            setLocationString('');
            if (res === false) {
                setShowInvalid(true);
            } else {
                props.hideModal();
            }
        });
    };

    return (
        <Modal size="sm" show={props.showModal} style={{marginTop: 60}} onHide={props.hideModal}>
            <Modal.Header>
                <Modal.Title id="small-header">Change your location</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p id="regular-text">Please input desired city or zip code.</p>
                <Form onSubmit={handleSubmit} style={{textAlign: 'center'}}>
                    <Row>
                        <Col xs={12}>
                            <Form.Group controlId="set-location" bssize="large">
                                <Form.Control 
                                    placeholder="City/Zipcode"
                                    value={locationString} 
                                    onChange={(e) => setLocationString(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button style={{marginTop: 5}} id="large-button" type="submit">Change Location</Button>
                    <Button variant="link" id="refresh-location" onClick={props.refreshLocation}>
                        <u>Revert to Original Location 
                            <i className="fa fa-refresh" style={{marginLeft: 10}} aria-hidden="true"></i>
                        </u>
                    </Button>
                </Form>
            </Modal.Body>
            <Toast show={showInvalid} delay={2000} onClose={() => setShowInvalid(false)} autohide
                id='toastError' style={{marginBottom: -50, marginRight: 0}}>
                <Toast.Body>Invalid city/zipcode</Toast.Body>
            </Toast>
        </Modal>
    );
}
