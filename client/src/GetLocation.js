import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function GetLocation(props) {

    const [zipCode, setZipCode] = useState('');

    const handleChangeZip = (value) => {
        setZipCode(value);
    }

    const handleSubmit = (e) => {
        props.setLatLong(e, zipCode)
    };

    const isNumeric = (value) => {
        return /^-{0,1}\d+$/.test(value);
    }

    const validateForm = () => {
        if (zipCode.length !== 5) {
            return false;
        }
        return isNumeric(zipCode);
    }

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
                                    placeholder="Pittsburgh, PA / 15213"
                                    value={zipCode} 
                                    onChange={(event) => {handleChangeZip(event.target.value)}}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button style={{marginTop: 10}} id="nextPage" disabled={!validateForm()} type="submit">Enter Page</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
