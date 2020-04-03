import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Toast from 'react-bootstrap/Toast'

export default function GetLocation(props) {

    const [zipCode, setZipCode] = useState('');
    const [showInvalid, setShowInvalid] = useState(false);

    const handleChangeZip = (value) => {
        setZipCode(value);
    }

    const handleSubmit = (e) => {
        props.setLatLong(e, zipCode).then((res) => {
            setShowInvalid(true);
        });
    };

    return (
        <Modal show={!props.state.isLoaded} style = {{marginTop: 60}}>
            <Modal.Header>
                <Modal.Title>Looking for your location...</Modal.Title>
                <Spinner animation="border" role="status" style = {{textAlign: 'right', color: "black"}}></Spinner>
            </Modal.Header>
            <Modal.Body>
                <p>Depending on server speeds, this make take a bit. If you’d like, you can input your current city/zip code.</p>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col xs={12}>
                            <Form.Group controlId="zip" bssize="large">
                                <Form.Control 
                                    placeholder="City/Zipcode"
                                    value={zipCode} 
                                    onChange={(event) => {handleChangeZip(event.target.value)}}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button style={{marginTop: 10}} id="nextPage" type="submit">Enter Page</Button>
                </Form>
            </Modal.Body>
            <Toast
                show={showInvalid}
                delay={300000}
                onClose={() => setShowInvalid(false)}
                autohide
                id='toastError'
                style={{marginBottom: 75, marginRight: 18}}>
                <Toast.Body>Invalid city/zipcode</Toast.Body>
            </Toast>
        </Modal>
    );
}
