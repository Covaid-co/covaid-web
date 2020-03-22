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
            <br></br>
            <h2 style = {{fontWeight: 300}}>Finding your location...</h2>
            <Spinner animation="border" role="status" style = {{marginBottom: 50}}>
                <span className="sr-only">Loading...</span>
            </Spinner>
            <h6 style = {{fontWeight: 300, fontStyle: 'italic'}}>
               If you are not redirected in 10 seconds, enter your current zipcode.
            </h6>
            <Row className="justify-content-md-center">
                <Col md={4} lg={5}></Col>
                <Col md={4} lg={2}>
                    <Form onSubmit={(event) => props.setLatLong(event, zipCode)}>
                        <br></br>
                        <FormControl type="text" 
                                    value={zipCode} 
                                    onChange={(event) => {handleChangeZip(event.target.value)}} 
                                    placeholder="Zip Code"/>
                        <br></br>
                        <Button variant="outline-success" 
                                type="submit"
                                disabled={!validateForm()}>
                                Enter
                        </Button>
                    </Form>
                </Col>
                <Col md={4} lg={5}></Col>
            </Row>
            </div>
        </Container>
    )
}