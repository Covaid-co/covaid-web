import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function Loading(props) {

    const [zipCode, setZipCode] = useState('');

    const handleChangeZip = (value) => {
        setZipCode(value);
    }

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
        <Container style = {{padding: '40px 15px'}}>
            <div className="p-3 mb-5 bg-white">
            <Spinner animation="border" role="status" style = {{marginBottom: 50}}>
                <span className="sr-only">Loading...</span>
            </Spinner>
            <br></br>
            <h3 style = {{fontWeight: 300}}>Enter your zipcode...</h3>
            <Row className="justify-content-md-center">
                <Col md={5}></Col>
                <Col md={2}>
                    <Form onSubmit={(event) => props.setLatLong(event, zipCode)}>
                        <br></br>
                        <FormControl type="text" 
                                    value={zipCode} 
                                    onChange={(event) => {handleChangeZip(event.target.value)}} 
                                    placeholder="Zip Code" 
                                    className="mr-sm-2" />
                        <br></br>
                        <Button variant="outline-success" 
                                type="submit"
                                disabled={!validateForm()}>
                                Enter
                        </Button>
                    </Form>
                </Col>
                <Col md={5}></Col>
            </Row>
            </div>
        </Container>
    )
}