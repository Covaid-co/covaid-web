import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { useFormFields } from "./libs/hooksLib";

import SelectionForm from './SelectionForm';

export default function LocationSetting(props) {

    const [locationString, setLocationString] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        e.stopPropagation();
        // console.log(locationString)
        props.handleLocationChange(locationString);
        props.locationSubmit(e, locationString);
    }

    return (
        <>
            <h1 id="enter-location">Enter your location</h1>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col lg={4} md={6} sm={6} xs={12}>
                        <InputGroup controlId="locationString" className="mb-3">
                            <FormControl
                                placeholder="Pittsburgh, Pennsylvania" 
                                aria-label="Pittsburgh, Pennsylvania"
                                aria-describedby="basic-addon2"
                                value={locationString}
                                onChange={e => setLocationString(e.target.value)}
                            />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" type="submit">Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                        <Button variant="link" 
                                id="refresh-location"
                                onClick={props.refreshLocation} >
                            <u>Return to Original Location 
                                <i className="fa fa-refresh" style={{marginLeft: 10}} aria-hidden="true"></i>
                            </u>
                        </Button>
                    </Col>
                    <Col md={6} sm={6} id="city-support-text-tablet">
                        <p style={{marginTop: -8, float: 'right'}}className="volunteer-location">
                            This city is supported by:<br/> 
                            <p style={{color: '#194bd3', float: 'right'}}className="volunteer-location">Pittsburgh Mutual Aid</p>
                        </p>
                    </Col>
                </Row>
                <Row id="web-separate">
                    <Col lg={4} md={6} sm={6} xs={12}>
                        <p id="requestCall" style={{marginTop: 20, marginBottom: 20}}></p>
                        <p style={{marginTop: -8, float: 'left'}}className="volunteer-location">
                            This city is supported by:<br/> 
                            <p style={{color: '#194bd3', float: 'left'}}className="volunteer-location">Pittsburgh Mutual Aid</p>
                        </p>
                    </Col>
                </Row>
                <Row id="mobile-tablet-separate">
                    <Col lg={12} md={12}>
                        <p id="requestCall" style={{marginTop: 20, marginBottom: 20}}></p>
                    </Col>
                </Row>
                <Row id="mobile-org">
                    <Col md={12}>
                        <p style={{marginTop: -8, float: 'left'}}className="volunteer-location">
                            This city is supported by:<br/> 
                            <p style={{color: '#194bd3', float: 'left'}}className="volunteer-location">Pittsburgh Mutual Aid</p>
                        </p>
                    </Col>
                </Row>
                {/* <Row>
                    <Col md={6} sm={6} xs={12}>
                        <p style={{marginTop: -8}}className="volunteer-location">This city is supported by:</p>
                        <p style={{marginTop: -8, color: '#194bd3'}}className="volunteer-location">Pittsburgh Mutual Aid</p>
                    </Col>
                </Row> */}
                {/* <Row>
                    <Col lg={4} md={6} sm={6}>
                        <p id="requestCall" style={{marginTop: 12, marginBottom: 20}}></p>
                    </Col>
                </Row> */}
            </Form>
        </>
    );
}